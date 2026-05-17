import { api } from "./client";
import type {
  HotReviewResponses,
  LikeToggleResponse,
  PlayerReviewCreateRequest,
  PlayerReviewCreateResponse,
} from "./types";

export function getHotReviews(size = 10) {
  return api.get<HotReviewResponses>("/api/v1/match-reviews/hot", {
    searchParams: { size },
  });
}

export function createPlayerReview(
  matchId: number,
  userId: number,
  body: PlayerReviewCreateRequest,
) {
  return api.post<PlayerReviewCreateResponse>(
    `/api/v1/matches/${matchId}/player-reviews`,
    { searchParams: { userId }, body },
  );
}

export function togglePlayerReviewLike(playerReviewId: number, userId: number) {
  return api.post<LikeToggleResponse>(
    `/api/v1/player-reviews/${playerReviewId}/likes`,
    { searchParams: { userId } },
  );
}
