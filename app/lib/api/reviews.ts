import { api } from "./client";
import type {
  HotReviewResponses,
  LikeToggleResponse,
  PlayerReviewCreateRequest,
  PlayerReviewCreateResponse,
  PlayerReviewUpdateRequest,
  PlayerReviewUpdateResponse,
  HomeResponses,
} from "./types";

export interface GetHomeDataParams {
  state?: "REVIEWABLE";
  season?: number;
}

export function getHomeData(params: GetHomeDataParams = {}) {
  return api.get<HomeResponses>("/api/v1/home", {
    searchParams: params as Record<string, any>,
  });
}

export function getHotReviews(size = 10) {
  return api.get<HotReviewResponses>("/api/v1/match-reviews/hot", {
    searchParams: { size },
  });
}

export function createPlayerReview(
  matchId: number,
  body: PlayerReviewCreateRequest,
) {
  return api.post<PlayerReviewCreateResponse>(
    `/api/v1/matches/${matchId}/player-reviews`,
    { body },
  );
}

export function updatePlayerReview(
  playerReviewId: number,
  userId: number,
  body: PlayerReviewUpdateRequest,
) {
  return api.patch<PlayerReviewUpdateResponse>(
    `/api/v1/player-reviews/${playerReviewId}`,
    {
      searchParams: { userId },
      body,
    },
  );
}

export function togglePlayerReviewLike(playerReviewId: number) {
  return api.post<LikeToggleResponse>(
    `/api/v1/player-reviews/${playerReviewId}/likes`,
  );
}

export function deletePlayerReview(playerReviewId: number, userId: number) {
  return api.delete<void>(`/api/v1/player-reviews/${playerReviewId}`, {
    searchParams: { userId },
  });
}
