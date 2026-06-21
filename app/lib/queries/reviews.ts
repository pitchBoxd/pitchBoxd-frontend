import { useQuery } from "@tanstack/react-query";
import { getHotReviews, getHomeData, type GetHomeDataParams } from "@/lib/api/reviews";
import { queryKeys } from "./keys";

export function useHomeData(params: GetHomeDataParams = {}) {
  return useQuery({
    queryKey: queryKeys.home.data(params),
    queryFn: () => getHomeData(params),
  });
}

export function useHotReviews(size = 10) {
  return useQuery({
    queryKey: queryKeys.reviews.hot(size),
    queryFn: () => getHotReviews(size).then((r) => r.responses),
  });
}
