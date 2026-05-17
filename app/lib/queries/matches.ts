import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMatchReview,
  getReviewableMatches,
  toggleMatchReviewLike,
} from "@/lib/api/matches";
import type { MatchReviewCreateRequest } from "@/lib/api/types";
import { queryKeys } from "./keys";

export function useReviewableMatches(
  userId: number | null,
  filter?: string,
) {
  return useQuery({
    queryKey: queryKeys.matches.reviewable(userId, filter),
    enabled: userId !== null,
    queryFn: () =>
      getReviewableMatches({ userId: userId as number, filter }).then(
        (r) => r.matchResponses,
      ),
  });
}

export function useCreateMatchReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      matchId: number;
      userId: number;
      body: MatchReviewCreateRequest;
    }) => createMatchReview(params.matchId, params.userId, params.body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.matches.all });
      qc.invalidateQueries({ queryKey: queryKeys.reviews.all });
    },
  });
}

export function useToggleMatchReviewLike() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { matchReviewId: number; userId: number }) =>
      toggleMatchReviewLike(params.matchReviewId, params.userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.reviews.all });
    },
  });
}
