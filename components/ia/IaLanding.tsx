import Image from "next/image";
import CompanyHero from "@/components/company/CompanyHero";
import CompanySectionHeading from "@/components/company/CompanySectionHeading";
import FadeInView from "@/components/company/FadeInView";
import TrackClickLink from "@/components/analytics/TrackClickLink";
import IaContentSections from "@/components/ia/IaContentSections";
import {
  COMPANY_PAGE_BG,
  COMPANY_SHELL,
} from "@/components/company/companyLayoutShared";
import { SECTION_SUBTITLE_CLASS } from "@/components/ui/SectionHeading";
import type { IaChildPage, IaHubPage } from "@/lib/iaPages";
import { childPath, hubPath, type IaHubKey } from "@/lib/iaPages";
import { Link } from "@/lib/i18n/navigation";
import { getPublicSiteUrl } from "@/lib/publicEnv";

type Crumb = { label: string; href?: string };

const IA_HERO_TITLE =
  "font-display px-2 text-balance break-words text-[clamp(1.625rem,5.5vw,3.125rem)] font-normal uppercase tracking-[0.06em] text-[#6a414d] sm:px-1 sm:tracking-[0.1em]";

/** Same primary CTA as navbar / contact — used on every IA hero (photo + text). */
const CTA_CLASS =
  "inline-flex items-center justify-center rounded-[8px] bg-[#6a414d] px-6 py-3 font-outfit text-[14px] font-medium tracking-wide text-white transition hover:bg-[#56343e] sm:text-[15px]";

const DEFAULT_CTA_HREF = "/contact";

function resolveCta(label?: string, href?: string) {
  const text = String(label || "").trim();
  if (!text) return null;
  const to = String(href || "").trim() || DEFAULT_CTA_HREF;
  return { label: text, href: to };
}

function absolutePath(locale: string, path?: string) {
  if (!path) return undefined;
  const base = getPublicSiteUrl().replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/" || normalized.startsWith(`/${locale}`)) {
    return `${base}${normalized === "/" ? `/${locale}` : normalized}`;
  }
  return `${base}/${locale}${normalized}`;
}

function Breadcrumbs({ items, locale }: { items: Crumb[]; locale: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href
        ? { item: absolutePath(locale, item.href) }
        : {}),
    })),
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={`${COMPANY_SHELL} pt-6 md:pt-8 font-outfit text-[13px] text-[#8a6b73]`}
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden className="text-[#c4a8ae]">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="transition hover:text-[#6a414d]">
                {item.label}
              </Link>
            ) : (
              <span className="text-[#6a414d]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
}

function HeroCta({
  label,
  href,
  location,
  className = "",
}: {
  label: string;
  href: string;
  location: string;
  className?: string;
}) {
  return (
    <TrackClickLink
      href={href}
      className={`${CTA_CLASS} ${className}`.trim()}
      ctaId="ia_consultation"
      ctaLocation={location}
    >
      {label}
    </TrackClickLink>
  );
}

function FullBleedHero({
  title,
  subtitle,
  eyebrow,
  image,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  image: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const cta = resolveCta(ctaLabel, ctaHref);
  return (
    <header
      data-nav-backdrop="dark"
      className="relative h-[min(62vh,680px)] min-h-[420px] w-full overflow-hidden sm:min-h-[480px]"
    >
      <Image
        src={image}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#2a151c]/88 via-[#2a151c]/40 to-[#2a151c]/20"
        aria-hidden
      />
      <div
        className={`relative z-10 flex h-full min-h-[420px] items-end sm:min-h-[480px] ${COMPANY_SHELL} pb-12 pt-28 md:pb-16`}
      >
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="mb-3 font-outfit text-[12px] uppercase tracking-[0.18em] text-white/75 sm:text-[13px]">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-display text-balance text-[clamp(2rem,6vw,3.5rem)] font-normal uppercase tracking-[0.08em] text-white">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-4 max-w-2xl font-outfit text-[16px] leading-relaxed text-white/90 md:text-[18px]">
              {subtitle}
            </p>
          ) : null}
          {cta ? (
            <HeroCta
              label={cta.label}
              href={cta.href}
              location="ia_fullbleed_hero"
              className="mt-8"
            />
          ) : null}
        </div>
      </div>
    </header>
  );
}

function TextHero({
  title,
  subtitle,
  eyebrow,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const cta = resolveCta(ctaLabel, ctaHref);
  return (
    <CompanyHero
      title={title}
      subtitle={subtitle}
      titleClassName={IA_HERO_TITLE}
      subtitleClassName={`${SECTION_SUBTITLE_CLASS} !mt-2.5 sm:!mt-3`}
      headingClassName="!mb-0"
      leading={
        eyebrow ? (
          <p className="mb-2 font-outfit text-[12px] uppercase tracking-[0.16em] text-[#b08992]">
            {eyebrow}
          </p>
        ) : undefined
      }
    >
      {cta ? (
        <div className="mt-2">
          <HeroCta label={cta.label} href={cta.href} location="ia_text_hero" />
        </div>
      ) : null}
    </CompanyHero>
  );
}

function PageHero({
  title,
  subtitle,
  eyebrow,
  image,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  image?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const src = String(image || "").trim();
  if (src) {
    return (
      <FullBleedHero
        title={title}
        subtitle={subtitle}
        eyebrow={eyebrow}
        image={src}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
      />
    );
  }
  return (
    <TextHero
      title={title}
      subtitle={subtitle}
      eyebrow={eyebrow}
      ctaLabel={ctaLabel}
      ctaHref={ctaHref}
    />
  );
}

function BodyCopy({ body, emptyHint }: { body: string; emptyHint: string }) {
  if (body) {
    return (
      <FadeInView className={`${COMPANY_SHELL} mt-10 md:mt-14`}>
        <div className="mx-auto max-w-3xl text-center whitespace-pre-wrap font-outfit text-[16px] leading-[1.75] text-[#4a3a3e] md:text-[17px]">
          {body}
        </div>
      </FadeInView>
    );
  }
  return (
    <div className={`${COMPANY_SHELL} mt-10`}>
      <p className="mx-auto max-w-2xl text-center font-outfit text-[15px] text-[#8a6b73]">
        {emptyHint}
      </p>
    </div>
  );
}

function RelatedGrid({
  heading,
  items,
}: {
  heading: string;
  items: { id: string; title: string; href: string; image?: string }[];
}) {
  if (!items.length) return null;
  return (
    <FadeInView className={`${COMPANY_SHELL} mt-16 md:mt-20 pb-16 md:pb-24`} delay={0.08}>
      <CompanySectionHeading title={heading} className="mb-8 md:mb-10" />
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <li key={item.id}>
            <FadeInView delay={0.04 * (i % 3)}>
              <Link href={item.href} className="group block">
                {item.image ? (
                  <div className="relative mb-4 aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : null}
                <span className="font-outfit text-[15px] font-medium text-[#3d2a30] transition group-hover:text-[#6a414d]">
                  {item.title}
                </span>
              </Link>
            </FadeInView>
          </li>
        ))}
      </ul>
    </FadeInView>
  );
}

function ChildLinkList({
  hubKey,
  items,
  exploreTitle,
  exploreSubtitle,
}: {
  hubKey: IaHubKey;
  items: { slug: string; title?: string; image?: string; subtitle?: string }[];
  exploreTitle?: string;
  exploreSubtitle?: string;
}) {
  if (!items.length) return null;
  const withImages = items.some((c) => Boolean(String(c.image || "").trim()));
  const sectionTitle = String(exploreTitle || "").trim() || "Explore";
  const sectionSubtitle =
    String(exploreSubtitle || "").trim() || "Choose a focus area to continue.";
  return (
    <FadeInView className={`${COMPANY_SHELL} mt-16 md:mt-20 pb-16 md:pb-24`} delay={0.06}>
      <CompanySectionHeading
        title={sectionTitle}
        subtitle={sectionSubtitle}
        subtitleSentenceCase={false}
        className="mb-8 md:mb-10"
      />
      <ul
        className={
          withImages
            ? "grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {items.map((child, i) => {
          const title = String(child.title || child.slug);
          const image = String(child.image || "").trim();
          const subtitle = String(child.subtitle || "").trim();
          return (
            <li key={child.slug} className="min-w-0">
              <FadeInView delay={0.04 * (i % 4)}>
                <Link
                  href={childPath(hubKey, child.slug)}
                  className={
                    image
                      ? "group block h-full"
                      : "group flex h-full min-h-[88px] flex-col justify-center rounded-[8px] border border-[#e5dcd3]/90 bg-white/40 px-5 py-4 transition hover:border-[#6a414d]/35 hover:bg-white"
                  }
                >
                  {image ? (
                    <div className="relative mb-4 aspect-[4/3] overflow-hidden">
                      <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                    </div>
                  ) : null}
                  <span className="font-outfit text-[16px] font-medium text-[#3d2a30] transition group-hover:text-[#6a414d] sm:text-[17px]">
                    {title}
                  </span>
                  {subtitle ? (
                    <span className="mt-1.5 line-clamp-2 block font-outfit text-[13px] leading-snug text-[#8a6b73]">
                      {subtitle}
                    </span>
                  ) : (
                    <span className="mt-1 block font-outfit text-[11px] uppercase tracking-[0.14em] text-[#b08992]">
                      {hubPath(hubKey)}/{child.slug}
                    </span>
                  )}
                </Link>
              </FadeInView>
            </li>
          );
        })}
      </ul>
    </FadeInView>
  );
}

function ServiceLinkList({
  items,
  title,
  subtitle,
}: {
  items: { id: string; title: string; href: string }[];
  title?: string;
  subtitle?: string;
}) {
  if (!items.length) return null;
  const sectionTitle = String(title || "").trim() || "Services in this location";
  const sectionSubtitle =
    String(subtitle || "").trim() || "How we support homes and projects here.";
  return (
    <FadeInView className={`${COMPANY_SHELL} mt-16 md:mt-20`} delay={0.06}>
      <CompanySectionHeading
        title={sectionTitle}
        subtitle={sectionSubtitle}
        subtitleSentenceCase={false}
        className="mb-8 md:mb-10"
      />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id} className="min-w-0">
            <Link
              href={item.href}
              className="group flex h-full min-h-[72px] items-center rounded-[8px] border border-[#e5dcd3]/90 bg-white/40 px-5 py-4 transition hover:border-[#6a414d]/35 hover:bg-white"
            >
              <span className="font-outfit text-[16px] font-medium text-[#3d2a30] transition group-hover:text-[#6a414d] sm:text-[17px]">
                {item.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </FadeInView>
  );
}

export function IaHubView({
  hubKey,
  hub,
  locale,
}: {
  hubKey: IaHubKey;
  hub: IaHubPage;
  locale: string;
  related?: { id: string; title: string; href: string; image?: string }[];
}) {
  const title = String(hub.hero?.title || hub.slug || "Page");
  const subtitle = String(hub.hero?.subtitle || "");
  const eyebrow = String(hub.hero?.eyebrow || "");
  const body = String(hub.body || "");
  const children = Array.isArray(hub.children) ? hub.children : [];
  const serviceLd =
    hubKey === "services"
      ? {
          "@context": "https://schema.org",
          "@type": "Service",
          name: title,
          description: subtitle || body || undefined,
          provider: { "@type": "Organization", name: "Varsovia Design" },
          url: absolutePath(locale, hubPath(hubKey)),
        }
      : null;

  return (
    <div className={COMPANY_PAGE_BG}>
      {serviceLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
        />
      ) : null}
      {!hub.hero?.image ? (
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} locale={locale} />
      ) : null}
      <PageHero
        title={title}
        subtitle={subtitle}
        eyebrow={eyebrow}
        image={hub.hero?.image}
        ctaLabel={hub.hero?.ctaLabel}
        ctaHref={hub.hero?.ctaHref}
      />
      {hub.hero?.image ? (
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} locale={locale} />
      ) : null}
      <BodyCopy
        body={body}
        emptyHint={
          hub.indexable
            ? "Content for this section can be edited in Admin → Varsovia → Site Settings."
            : "Content for this section can be edited in Admin → Varsovia → Site Settings. This page is currently noindex until content is ready."
        }
      />
      <IaContentSections sections={hub.sections} hubKey={hubKey} />
      <ChildLinkList
        hubKey={hubKey}
        exploreTitle={hub.exploreTitle}
        exploreSubtitle={hub.exploreSubtitle}
        items={children.map((c) => ({
          slug: c.slug,
          title: String(c.hero?.title || c.title || c.slug),
          image: c.hero?.image,
          subtitle: c.hero?.subtitle,
        }))}
      />
    </div>
  );
}

export function IaChildView({
  hubKey,
  hubTitle,
  child,
  locale,
  related,
  relatedServices,
  servicesTitle,
  servicesSubtitle,
}: {
  hubKey: IaHubKey;
  hubTitle: string;
  child: IaChildPage;
  locale: string;
  related?: { id: string; title: string; href: string; image?: string }[];
  relatedServices?: { id: string; title: string; href: string }[];
  servicesTitle?: string;
  servicesSubtitle?: string;
}) {
  const title = String(child.hero?.title || child.title || child.slug);
  const subtitle = String(child.hero?.subtitle || "");
  const eyebrow = String(child.hero?.eyebrow || "");
  const body = String(child.body || "");
  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: hubTitle, href: hubPath(hubKey) },
    { label: title },
  ];

  const localBusinessLd =
    hubKey === "locations"
      ? {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: `Varsovia Design — ${title}`,
          description: subtitle || body || undefined,
          areaServed: title,
          url: absolutePath(locale, childPath(hubKey, child.slug)),
        }
      : null;

  const serviceLd =
    hubKey === "services"
      ? {
          "@context": "https://schema.org",
          "@type": "Service",
          name: title,
          description: subtitle || body || undefined,
          provider: { "@type": "Organization", name: "Varsovia Design" },
          areaServed: "Thailand",
          url: absolutePath(locale, childPath(hubKey, child.slug)),
        }
      : null;

  const relatedHeading =
    String(child.relatedTitle || "").trim() ||
    (hubKey === "journal"
      ? "Articles in this topic"
      : hubKey === "furniture"
        ? "Related furniture projects"
        : "Related projects");

  return (
    <div className={COMPANY_PAGE_BG}>
      {localBusinessLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
        />
      ) : null}
      {serviceLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
        />
      ) : null}
      {!child.hero?.image ? <Breadcrumbs items={crumbs} locale={locale} /> : null}
      <PageHero
        title={title}
        subtitle={subtitle}
        eyebrow={eyebrow}
        image={child.hero?.image}
        ctaLabel={child.hero?.ctaLabel}
        ctaHref={child.hero?.ctaHref}
      />
      {child.hero?.image ? <Breadcrumbs items={crumbs} locale={locale} /> : null}
      <BodyCopy
        body={body}
        emptyHint="Add copy in Admin → Varsovia → Site Settings. Page remains noindex until marked indexable."
      />
      <IaContentSections sections={child.sections} hubKey={hubKey} />
      <ServiceLinkList
        items={relatedServices || []}
        title={servicesTitle}
        subtitle={servicesSubtitle}
      />
      <RelatedGrid heading={relatedHeading} items={related || []} />
    </div>
  );
}
