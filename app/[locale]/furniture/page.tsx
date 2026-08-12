import { makeIaHubHandlers } from "@/lib/iaRouteFactory";

const handlers = makeIaHubHandlers("furniture");
export const generateMetadata = handlers.generateMetadata;
export default handlers.Page;
