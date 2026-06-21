import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import {
  createMatchReview,
  updateMatchReview,
  deleteMatchReview,
  getReviewableMatches,
  toggleMatchReviewLike,
  getMatchResultData,
  getMatchPersonalData,
  getMatchHotReviews,
  getMatchReviews,
  getMatchStatsData,
  getPlayerReviews,
  getMatches,
  type GetMatchesParams,
} from "@/lib/api/matches";
import { createPlayerReview, updatePlayerReview, deletePlayerReview, togglePlayerReviewLike } from "@/lib/api/reviews";
import type { MatchReviewCreateRequest, MatchReviewUpdateRequest, PlayerReviewCreateRequest, PlayerReviewUpdateRequest } from "@/lib/api/types";
import { queryKeys } from "./keys";

export function useMatchResultData(matchId: number) {
  return useQuery({
    queryKey: ["matches", "detail", matchId],
    queryFn: () => getMatchResultData(matchId),
  });
}

export function useMatchStatsData(matchId: number) {
  return useQuery({
    queryKey: ["matches", "stats", matchId],
    queryFn: () => getMatchStatsData(matchId),
  });
}

export function useMatchPersonalData(matchId: number, userId: number | null) {
  return useQuery({
    queryKey: ["matches", "personal", { matchId, userId }],
    enabled: userId !== null,
    queryFn: () => getMatchPersonalData(matchId),
  });
}

export function useMatchHotReviews(matchId: number, userId: number | null, limit = 5) {
  return useQuery({
    queryKey: ["reviews", "matchHot", { matchId, userId, limit }],
    queryFn: () => getMatchHotReviews(matchId, userId ?? 0, limit).then((r) => r.responses),
  });
}

export function useMatchReviewsInfinite(
  matchId: number,
  userId: number | null,
  sort: "LATEST" | "LIKE",
  size = 10
) {
  return useInfiniteQuery({
    queryKey: ["reviews", "matchAll", { matchId, userId, sort, size }],
    queryFn: ({ pageParam }) => {
      const params: any = { sort, size };
      if (pageParam) {
        params.cursorId = pageParam.cursorId;
        if (sort === "LIKE") {
          params.cursorLikeCount = pageParam.cursorLikeCount;
        }
      }
      return getMatchReviews(matchId, userId ?? 0, params);
    },
    initialPageParam: null as { cursorId: number; cursorLikeCount?: number } | null,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNext || !lastPage.nextCursorId) return undefined;
      return {
        cursorId: lastPage.nextCursorId,
        cursorLikeCount: lastPage.nextCursorLikeCount,
      };
    },
  });
}

export function useCreatePlayerReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      matchId: number;
      userId: number;
      body: PlayerReviewCreateRequest;
    }) => createPlayerReview(params.matchId, params.body),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["matches", "personal", { matchId: variables.matchId, userId: variables.userId }] });
      qc.invalidateQueries({ queryKey: ["matches", "detail", variables.matchId] });
      qc.invalidateQueries({ queryKey: ["matches", "stats", variables.matchId] });
    },
  });
}

export function useUpdatePlayerReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      playerReviewId: number;
      matchId: number;
      userId: number;
      body: PlayerReviewUpdateRequest;
    }) => updatePlayerReview(params.playerReviewId, params.userId, params.body),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["matches", "personal", { matchId: variables.matchId, userId: variables.userId }] });
      qc.invalidateQueries({ queryKey: ["matches", "detail", variables.matchId] });
      qc.invalidateQueries({ queryKey: ["matches", "stats", variables.matchId] });
    },
  });
}

export function useDeletePlayerReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      playerReviewId: number;
      matchId: number;
      userId: number;
    }) => deletePlayerReview(params.playerReviewId, params.userId),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["matches", "personal", { matchId: variables.matchId, userId: variables.userId }] });
      qc.invalidateQueries({ queryKey: ["matches", "detail", variables.matchId] });
      qc.invalidateQueries({ queryKey: ["matches", "stats", variables.matchId] });
    },
  });
}

export function useTogglePlayerReviewLike() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { playerReviewId: number; userId: number }) =>
      togglePlayerReviewLike(params.playerReviewId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
      qc.invalidateQueries({ queryKey: ["matches"] });
    },
  });
}

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

export function useMatches(params: GetMatchesParams = {}) {
  return useQuery({
    queryKey: ["matches", "list", params],
    queryFn: () => getMatches(params).then((r) => r.matchResponses),
  });
}

export function useCreateMatchReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      matchId: number;
      userId: number;
      body: MatchReviewCreateRequest;
    }) => createMatchReview(params.matchId, params.body),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.matches.all });
      qc.invalidateQueries({ queryKey: queryKeys.reviews.all });
      qc.invalidateQueries({ queryKey: ["matches", "personal", { matchId: variables.matchId, userId: variables.userId }] });
      qc.invalidateQueries({ queryKey: ["reviews", "matchHot", { matchId: variables.matchId, userId: variables.userId }] });
      qc.invalidateQueries({ queryKey: ["matches", "stats", variables.matchId] });
    },
  });
}

export function useUpdateMatchReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      matchReviewId: number;
      matchId: number;
      userId: number;
      body: MatchReviewUpdateRequest;
    }) => updateMatchReview(params.matchReviewId, params.userId, params.body),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.matches.all });
      qc.invalidateQueries({ queryKey: queryKeys.reviews.all });
      qc.invalidateQueries({ queryKey: ["matches", "personal", { matchId: variables.matchId, userId: variables.userId }] });
      qc.invalidateQueries({ queryKey: ["reviews", "matchHot", { matchId: variables.matchId, userId: variables.userId }] });
      qc.invalidateQueries({ queryKey: ["matches", "stats", variables.matchId] });
    },
  });
}

export function useDeleteMatchReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      matchReviewId: number;
      matchId: number;
      userId: number;
    }) => deleteMatchReview(params.matchReviewId, params.userId),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.matches.all });
      qc.invalidateQueries({ queryKey: queryKeys.reviews.all });
      qc.invalidateQueries({ queryKey: ["matches", "personal", { matchId: variables.matchId, userId: variables.userId }] });
      qc.invalidateQueries({ queryKey: ["reviews", "matchHot", { matchId: variables.matchId, userId: variables.userId }] });
      qc.invalidateQueries({ queryKey: ["matches", "stats", variables.matchId] });
    },
  });
}

export function useToggleMatchReviewLike() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { matchReviewId: number; userId: number }) =>
      toggleMatchReviewLike(params.matchReviewId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.reviews.all });
      qc.invalidateQueries({ queryKey: ["reviews"] });
      qc.invalidateQueries({ queryKey: ["matches", "personal"] });
    },
  });
}

export function usePlayerReviews(
  matchId: number,
  playerId: number,
  userId: number | null,
  enabled: boolean,
  sort: "LATEST" | "LIKE" = "LATEST",
  size = 30
) {
  return useQuery({
    queryKey: ["reviews", "player", { matchId, playerId, userId, sort, size }],
    enabled,
    queryFn: () => getPlayerReviews(matchId, playerId, { sort, size }),
  });
}

export function usePlayerReviewsInfinite(
  matchId: number,
  playerId: number,
  userId: number | null,
  sort: "LATEST" | "LIKE",
  enabled: boolean,
  size = 10
) {
  return useInfiniteQuery({
    queryKey: ["reviews", "playerAll", { matchId, playerId, userId, sort, size }],
    enabled,
    queryFn: ({ pageParam }) => {
      const params: any = { sort, size };
      if (pageParam) {
        params.cursorId = pageParam.cursorId;
        if (sort === "LIKE") {
          params.cursorLikeCount = pageParam.cursorLikeCount;
        }
      }
      return getPlayerReviews(matchId, playerId, params);
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNext) return undefined;
      return {
        cursorId: lastPage.nextCursorId,
        cursorLikeCount: lastPage.nextCursorLikeCount,
      };
    },
    initialPageParam: undefined as any,
  });
}
