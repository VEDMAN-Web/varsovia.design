import { makeIaHubHandlers } from "@/lib/iaRouteFactory";

const handlers = makeIaHubHandlers("completeInteriors");
export const generateMetadata = handlers.generateMetadata;
export default handlers.Page;
