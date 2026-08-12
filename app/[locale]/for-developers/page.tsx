import { makeIaHubHandlers } from "@/lib/iaRouteFactory";

const handlers = makeIaHubHandlers("forDevelopers");
export const generateMetadata = handlers.generateMetadata;
export default handlers.Page;
