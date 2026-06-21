import { api } from "./client";
import type {
  MatchResponses,
  MatchReviewCreateRequest,
  MatchReviewCreateResponse,
  MatchReviewUpdateRequest,
  MatchReviewUpdateResponse,
  LikeToggleResponse,
  TeamResponses,
  TeamDetailResponses,
  MatchDetailResultResponse,
  MatchDetailPersonalResponse,
  MatchDetailMatchReviewResponses,
  MatchReviewSliceResponse,
  MatchDetailStatsResponse,
  PlayerReviewSliceResponse,
  SeasonResponses,
} from "./types";

export function getTeams() {
  return api.get<TeamResponses>("/api/v1/teams");
}

export function getTeamDetails() {
  return api.get<TeamDetailResponses>("/api/v1/teams/details");
}

export function getSeasons() {
  return api.get<SeasonResponses>("/api/v1/seasons");
}

export function getMatchResultData(matchId: number) {
  return api.get<MatchDetailResultResponse>(`/api/v1/matches/${matchId}/detail/result`);
}

export function getMatchStatsData(matchId: number) {
  return api.get<MatchDetailStatsResponse>(`/api/v1/matches/${matchId}/detail/stats`);
}

export function getMatchPersonalData(matchId: number) {
  return api.get<MatchDetailPersonalResponse>(`/api/v1/matches/${matchId}/detail/personal`);
}

export function getMatchHotReviews(matchId: number, userId: number, limit = 5) {
  return api.get<MatchDetailMatchReviewResponses>(`/api/v1/matches/${matchId}/match-reviews/hot`, {
    searchParams: { userId, limit },
  });
}

export function getMatchReviews(
  matchId: number,
  userId: number,
  params: { cursorId?: number; cursorLikeCount?: number; sort?: "LATEST" | "LIKE"; size?: number } = {},
) {
  return api.get<MatchReviewSliceResponse>(`/api/v1/matches/${matchId}/match-reviews`, {
    searchParams: { userId, ...params },
  });
}

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

export interface GetMatchesParams {
  teamId?: number;
  seasonId?: number;
}

export function getMatches(params: GetMatchesParams = {}) {
  return api.get<MatchResponses>("/api/v1/matches", {
    searchParams: params,
  });
}

export function createMatchReview(
  matchId: number,
  body: MatchReviewCreateRequest,
) {
  return api.post<MatchReviewCreateResponse>(
    `/api/v1/matches/${matchId}/match-reviews`,
    { body },
  );
}

export function updateMatchReview(
  matchReviewId: number,
  userId: number,
  body: MatchReviewUpdateRequest,
) {
  return api.patch<MatchReviewUpdateResponse>(
    `/api/v1/match-reviews/${matchReviewId}`,
    {
      searchParams: { userId },
      body,
    },
  );
}

export function deleteMatchReview(matchReviewId: number, userId: number) {
  return api.delete<void>(`/api/v1/match-reviews/${matchReviewId}`, {
    searchParams: { userId },
  });
}

export function toggleMatchReviewLike(matchReviewId: number) {
  return api.post<LikeToggleResponse>(
    `/api/v1/match-reviews/${matchReviewId}/likes`,
  );
}

export function getPlayerReviews(
  matchId: number,
  playerId: number,
  params: { cursorId?: number; cursorLikeCount?: number; sort?: "LATEST" | "LIKE"; size?: number }
) {
  return api.get<PlayerReviewSliceResponse>(
    `/api/v1/matches/${matchId}/players/${playerId}/player-reviews`,
    { searchParams: params }
  );
}

