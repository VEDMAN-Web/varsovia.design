import { makeIaHubHandlers } from "@/lib/iaRouteFactory";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const handlers = makeIaHubHandlers("services");
export const generateMetadata = handlers.generateMetadata;

export default async function Page(props: {
  params: Promise<{ locale: string }>;
}) {
  return handlers.Page(props);
}
