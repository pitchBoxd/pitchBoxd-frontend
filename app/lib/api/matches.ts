import { api } from "./client";
import type {
  MatchResponses,
  MatchReviewCreateRequest,
  MatchReviewCreateResponse,
  LikeToggleResponse,
} from "./types";

export interface GetReviewableMatchesParams {
  userId: number;
  filter?: string;
}

export function getReviewableMatches({
  userId,
  filter,
}: GetReviewableMatchesParams) {
  return api.get<MatchResponses>("/api/v1/matches/reviewable", {
    searchParams: { userId, filter },
  });
}

export function createMatchReview(
  matchId: number,
  userId: number,
  body: MatchReviewCreateRequest,
) {
  return api.post<MatchReviewCreateResponse>(
    `/api/v1/matches/${matchId}/match-reviews`,
    { searchParams: { userId }, body },
  );
}

export function toggleMatchReviewLike(matchReviewId: number, userId: number) {
  return api.post<LikeToggleResponse>(
    `/api/v1/match-reviews/${matchReviewId}/likes`,
    { searchParams: { userId } },
  );
}
