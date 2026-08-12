import { getPublicSiteUrl } from "@/lib/publicEnv";

type Props = {
  name?: string;
  description?: string;
  logo?: string;
  email?: string;
  telephone?: string;
};

export default function OrganizationJsonLd({
  name = "Varsovia Design",
  description,
  logo,
  email,
  telephone,
}: Props) {
  const base = getPublicSiteUrl().replace(/\/$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: base,
    ...(description ? { description } : {}),
    ...(logo ? { logo } : {}),
    ...(email ? { email } : {}),
    ...(telephone ? { telephone } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
