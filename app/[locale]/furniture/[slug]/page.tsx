import { makeIaChildHandlers } from "@/lib/iaRouteFactory";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

const handlers = makeIaChildHandlers("furniture");
export const generateMetadata = handlers.generateMetadata;

/** Wrapper required: Turbopack can fail to run factory-exported Page on [slug] routes. */
export default async function Page(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  return handlers.Page(props);
}
