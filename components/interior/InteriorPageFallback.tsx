import { InteriorListingBodySkeleton } from "@/components/ui/skeleton/routeSkeletons";

/** Interior Suspense fallback (Navbar is rendered by the route shell). */
export default function InteriorPageFallback() {
  return <InteriorListingBodySkeleton />;
}
