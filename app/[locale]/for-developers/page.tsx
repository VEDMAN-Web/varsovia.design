import { makeIaHubHandlers } from "@/lib/iaRouteFactory";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const handlers = makeIaHubHandlers("forDevelopers");
export const generateMetadata = handlers.generateMetadata;
export default handlers.Page;
