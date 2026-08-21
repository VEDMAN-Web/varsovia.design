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
  normalizeIaSlug,
  strField,
  type IaHubKey,
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
import { getPublicSiteUrl } from "@/lib/publicEnv";

function locTitle(value: unknown, fallback: string, locale: Locale | string = "en") {
  return strField(value, fallback, locale);
}

const CITY_ADDRESS: Record<
  string,
  {
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
  }
> = {
  "koh-samui": {
    addressLocality: "Ko Samui",
    addressRegion: "Surat Thani",
    postalCode: "84330",
  },
  phuket: { addressLocality: "Phuket", addressRegion: "Phuket", postalCode: "83000" },
  bangkok: { addressLocality: "Bangkok", addressRegion: "Bangkok" },
  pattaya: {
    addressLocality: "Pattaya",
    addressRegion: "Chon Buri",
    postalCode: "20150",
  },
  "hua-hin": {
    addressLocality: "Hua Hin",
    addressRegion: "Prachuap Khiri Khan",
  },
  "chiang-mai": {
    addressLocality: "Chiang Mai",
    addressRegion: "Chiang Mai",
  },
};

function officeAddressForSlug(
  site: {
    footerOffices?: Array<{ label?: string; address?: string }>;
    address?: string;
  },
  slug: string,
) {
  const meta = CITY_ADDRESS[slug] || {
    addressLocality: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  };
  const offices = Array.isArray(site.footerOffices) ? site.footerOffices : [];
  const needles: Record<string, string[]> = {
    "koh-samui": ["samui"],
    phuket: ["phuket"],
    pattaya: ["pattaya"],
    bangkok: ["bangkok"],
    "hua-hin": ["hua hin", "huahin"],
    "chiang-mai": ["chiang mai", "chiangmai"],
  };
  const keys = needles[slug] || [slug.replace(/-/g, " ")];
  const found = offices.find((office) => {
    const blob = `${office.label || ""} ${office.address || ""}`.toLowerCase();
    return keys.some((key) => blob.includes(key));
  });
  const streetAddress = String(found?.address || "").trim();
  return {
    ...(streetAddress ? { streetAddress } : {}),
    addressLocality: meta.addressLocality,
    ...(meta.addressRegion ? { addressRegion: meta.addressRegion } : {}),
    ...(meta.postalCode ? { postalCode: meta.postalCode } : {}),
    addressCountry: "TH",
  };
}

function sameAsLinks(site: {
  facebookUrl?: string;
  instagramUrl?: string;
  whatsappUrl?: string;
  xUrl?: string;
}) {
  return [
    site.facebookUrl,
    site.instagramUrl,
    site.whatsappUrl,
    site.xUrl,
  ]
    .map((url) => String(url || "").trim())
    .filter((url) => /^https?:\/\//i.test(url));
}

function absoluteMediaUrl(path: string) {
  const raw = String(path || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const base = getPublicSiteUrl().replace(/\/$/, "");
  return `${base}${raw.startsWith("/") ? raw : `/${raw}`}`;
}

type RelatedItem = { id: string; title: string; href: string; image?: string };

function projectToRelated(p: {
  _id?: string;
  slug?: string;
  title?: unknown;
  coverImage?: string;
}, locale: Locale | string = "en"): RelatedItem {
  return {
    id: String(p._id || p.slug),
    title: strField(p.title, "Project", locale),
    href: `/interior-design/${p.slug || p._id}`,
    image: String(p.coverImage || ""),
  };
}

function showcaseToRelated(s: {
  _id?: string;
  title?: unknown;
  image?: string;
}, locale: Locale | string = "en"): RelatedItem {
  return {
    id: String(s._id),
    title: strField(s.title, "Project", locale),
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
    const hub = getIaHub(site, hubKey, locale);
    const title = locTitle(hub.metaTitle || hub.hero?.title, hub.slug, locale).slice(0, 60);
    const description = locTitle(hub.metaDescription || hub.hero?.subtitle, "", locale).slice(0, 160);
    return pageMetadata({
      title,
      description,
      path: `/${locale}${hubPath(hubKey)}`,
      locale,
      indexable: hub.indexable === true,
      image: locTitle(hub.hero?.image, "", locale),
    });
  }

  async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const site = await fetchSite(locale as Locale);
    const hub = getIaHub(site, hubKey, locale);
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
    const slug = normalizeIaSlug(rawSlug);
    const site = await fetchSite(locale as Locale);
    const child = getIaChild(site, hubKey, slug, locale);
    if (!child) return { title: "Not found" };
    const title = locTitle(child.metaTitle || child.hero?.title || child.title, slug, locale).slice(0, 60);
    const description = locTitle(
      child.metaDescription || child.hero?.subtitle,
      "",
      locale,
    ).slice(0, 160);
    return pageMetadata({
      title,
      description,
      path: `/${locale}${childPath(hubKey, slug)}`,
      locale,
      indexable: child.indexable === true,
      image: locTitle(child.hero?.image, "", locale),
    });
  }

  async function Page({
    params,
  }: {
    params: Promise<{ locale: string; slug: string }>;
  }) {
    const { locale, slug: rawSlug } = await params;
    const slug = normalizeIaSlug(rawSlug);
    setRequestLocale(locale);
    const site = await fetchSite(locale as Locale);
    const hub = getIaHub(site, hubKey, locale);
    const child = getIaChild(site, hubKey, slug, locale);
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
          .map((p) => projectToRelated(p, locale)),
        ...(Array.isArray(showcases) ? showcases : [])
          .filter((s) => locationMatchesSlug((s as { location?: unknown }).location, slug))
          .slice(0, 6)
          .map((s) => showcaseToRelated(s, locale)),
      ].slice(0, 6);

      const servicesHub = getIaHub(site, "services", locale);
      relatedServices = servicesForLocationSlug(
        slug,
        (servicesHub.children || []).filter((c) => c.slug),
        6,
      ).map((c) => ({
        id: c.slug,
        title: strField(c.title, c.slug, locale),
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
        .map((p) => projectToRelated(p, locale));

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
        .map((s) => showcaseToRelated(s, locale));

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
          title: strField(b.title, "Article", locale),
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
            hubTitle={locTitle(hub.hero?.title, hub.slug, locale)}
            child={child}
            locale={locale}
            related={related}
            relatedServices={relatedServices}
            servicesTitle={
              hubKey === "locations"
                ? strField(child.servicesTitle, hub.servicesTitle || "", locale)
                : undefined
            }
            servicesSubtitle={
              hubKey === "locations"
                ? strField(child.servicesSubtitle, hub.servicesSubtitle || "", locale)
                : undefined
            }
            contact={
              hubKey === "locations"
                ? {
                    telephone: String(site.contactPhone || site.phone || "").trim() || undefined,
                    email: String(site.email || "").trim() || undefined,
                    address: officeAddressForSlug(site, slug),
                    image: absoluteMediaUrl(strField(child.hero?.image, "", locale)) || undefined,
                    sameAs: sameAsLinks(site),
                  }
                : undefined
            }
          />
        </main>
      </>
    );
  }

  return { generateMetadata, Page };
}
