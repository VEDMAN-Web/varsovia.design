import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { IaChildView, IaHubView } from "@/components/ia/IaLanding";
import { fetchBlogs, fetchProjects, fetchShowcases, fetchSite } from "@/lib/api";
import {
  childPath,
  getIaChild,
  getIaHub,
  hubPath,
  type IaHubKey,
  DEFAULT_IA_PAGES,
} from "@/lib/iaPages";
import {
  interiorCategoriesForFurnitureSlug,
  locationMatchesSlug,
  normalizeFurnitureSlug,
} from "@/lib/furnitureTaxonomy";
import { servicesForLocationSlug } from "@/lib/locationServices";
import { blogMatchesJournalTopic } from "@/lib/journalTopics";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";
import { resolveBlogs } from "@/lib/companyData";

function locTitle(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

type RelatedItem = { id: string; title: string; href: string; image?: string };

function projectToRelated(p: {
  _id?: string;
  slug?: string;
  title?: string;
  coverImage?: string;
}): RelatedItem {
  return {
    id: String(p._id || p.slug),
    title: String(p.title || "Project"),
    href: `/interior-design/${p.slug || p._id}`,
    image: String(p.coverImage || ""),
  };
}

function showcaseToRelated(s: {
  _id?: string;
  title?: string;
  image?: string;
}): RelatedItem {
  return {
    id: String(s._id),
    title: String(s.title || "Project"),
    href: `/projects/${s._id}`,
    image: String(s.image || ""),
  };
}

export function makeIaHubHandlers(hubKey: IaHubKey) {
  async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }): Promise<Metadata> {
    const { locale } = await params;
    const site = await fetchSite(locale as Locale);
    const hub = getIaHub(site, hubKey);
    const title = locTitle(hub.metaTitle || hub.hero?.title, hub.slug).slice(0, 60);
    const description = locTitle(hub.metaDescription || hub.hero?.subtitle, "").slice(0, 160);
    return pageMetadata({
      title,
      description,
      path: `/${locale}${hubPath(hubKey)}`,
      locale,
      indexable: hub.indexable === true,
    });
  }

  async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const site = await fetchSite(locale as Locale);
    const hub = getIaHub(site, hubKey);
    return (
      <>
        <Navbar />
        <main>
          <IaHubView hubKey={hubKey} hub={hub} locale={locale} />
        </main>
      </>
    );
  }

  return { generateMetadata, Page };
}

export function makeIaChildHandlers(hubKey: IaHubKey) {
  async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: string; slug: string }>;
  }): Promise<Metadata> {
    const { locale, slug: rawSlug } = await params;
    const slug = decodeURIComponent(String(rawSlug || "")).trim();
    const site = await fetchSite(locale as Locale);
    const child = getIaChild(site, hubKey, slug);
    if (!child) return { title: "Not found" };
    const title = locTitle(child.metaTitle || child.hero?.title || child.title, slug).slice(0, 60);
    const description = locTitle(
      child.metaDescription || child.hero?.subtitle,
      "",
    ).slice(0, 160);
    return pageMetadata({
      title,
      description,
      path: `/${locale}${childPath(hubKey, slug)}`,
      locale,
      indexable: child.indexable === true,
    });
  }

  async function generateStaticParams() {
    const site = await fetchSite("en");
    const hub = getIaHub(site, hubKey);
    const children = Array.isArray(hub.children) && hub.children.length > 0
      ? hub.children
      : ((DEFAULT_IA_PAGES[hubKey] as { children?: { slug: string }[] }).children || []);
    return children
      .filter((c) => typeof c.slug === "string" && c.slug)
      .map((c) => ({ slug: c.slug }));
  }

  async function Page({
    params,
  }: {
    params: Promise<{ locale: string; slug: string }>;
  }) {
    const { locale, slug: rawSlug } = await params;
    const slug = decodeURIComponent(String(rawSlug || "")).trim();
    setRequestLocale(locale);
    const site = await fetchSite(locale as Locale);
    const hub = getIaHub(site, hubKey);
    const child = getIaChild(site, hubKey, slug);
    if (!child) notFound();

    let related: RelatedItem[] = [];
    let relatedServices: { id: string; title: string; href: string }[] = [];

    if (hubKey === "locations") {
      const [projects, showcases] = await Promise.all([
        fetchProjects(locale as Locale).catch(() => []),
        fetchShowcases(locale as Locale).catch(() => []),
      ]);

      related = [
        ...projects
          .filter((p) => locationMatchesSlug((p as { location?: unknown }).location, slug))
          .slice(0, 6)
          .map((p) => projectToRelated(p)),
        ...(Array.isArray(showcases) ? showcases : [])
          .filter((s) => locationMatchesSlug((s as { location?: unknown }).location, slug))
          .slice(0, 6)
          .map((s) => showcaseToRelated(s)),
      ].slice(0, 6);

      const servicesHub = getIaHub(site, "services");
      relatedServices = servicesForLocationSlug(
        slug,
        (servicesHub.children || []).filter((c) => c.slug),
        6,
      ).map((c) => ({
        id: c.slug,
        title: String(c.title || c.slug),
        href: childPath("services", c.slug),
      }));
    }

    if (hubKey === "furniture") {
      const furnitureSlug = normalizeFurnitureSlug(slug);
      const cats = furnitureSlug
        ? interiorCategoriesForFurnitureSlug(furnitureSlug)
        : [];
      const catSet = new Set(cats.map((c) => c.toLowerCase()));

      const [projects, showcases] = await Promise.all([
        fetchProjects(locale as Locale).catch(() => []),
        fetchShowcases(locale as Locale).catch(() => []),
      ]);

      const fromProjects = projects
        .filter((p) => {
          const cat = String((p as { category?: unknown }).category || "").toLowerCase();
          if (!cat) return furnitureSlug === "whole-house";
          return catSet.size === 0 || [...catSet].some((c) => cat.includes(c.toLowerCase()));
        })
        .slice(0, 6)
        .map((p) => projectToRelated(p));

      const fromShowcases = (Array.isArray(showcases) ? showcases : [])
        .filter((s) => {
          const tagged = normalizeFurnitureSlug(
            (s as { furnitureSlug?: unknown }).furnitureSlug,
          );
          if (furnitureSlug && tagged === furnitureSlug) return true;
          const cat = String((s as { category?: unknown }).category || "").toLowerCase();
          return furnitureSlug
            ? cat.includes(furnitureSlug.replace(/-/g, " ")) ||
                cat.includes(furnitureSlug.split("-")[0] || "")
            : false;
        })
        .slice(0, 6)
        .map((s) => showcaseToRelated(s));

      related = [...fromShowcases, ...fromProjects].slice(0, 6);
    }

    if (hubKey === "journal") {
      const blogs = resolveBlogs(
        await fetchBlogs(locale as Locale).catch(() => []),
        locale as Locale,
      );
      related = blogs
        .filter((b) => blogMatchesJournalTopic(b.category, slug))
        .slice(0, 12)
        .map((b) => ({
          id: b._id,
          title: b.title,
          href: `/journal/p/${b._id}`,
          image: b.image,
        }));
    }

    return (
      <>
        <Navbar />
        <main>
          <IaChildView
            hubKey={hubKey}
            hubTitle={locTitle(hub.hero?.title, hub.slug)}
            child={child}
            locale={locale}
            related={related}
            relatedServices={relatedServices}
            servicesTitle={hubKey === "locations" ? hub.servicesTitle : undefined}
            servicesSubtitle={hubKey === "locations" ? hub.servicesSubtitle : undefined}
          />
        </main>
      </>
    );
  }

  return { generateMetadata, generateStaticParams, Page };
}
