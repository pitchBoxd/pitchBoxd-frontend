import { useQuery } from "@tanstack/react-query";
import { getHotReviews } from "@/lib/api/reviews";
import { queryKeys } from "./keys";

export function useHotReviews(size = 10) {
  return useQuery({
    queryKey: queryKeys.reviews.hot(size),
    queryFn: () => getHotReviews(size).then((r) => r.responses),
  });
}
