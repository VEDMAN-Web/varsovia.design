import { makeIaHubHandlers } from "@/lib/iaRouteFactory";

const handlers = makeIaHubHandlers("locations");
export const generateMetadata = handlers.generateMetadata;
export default handlers.Page;
