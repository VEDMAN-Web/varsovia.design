import { makeIaChildHandlers } from "@/lib/iaRouteFactory";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

const handlers = makeIaChildHandlers("services");
export const generateMetadata = handlers.generateMetadata;

export default async function Page(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  return handlers.Page(props);
}
