// Types mirroring backend OpenAPI schema (http://localhost:8080/v3/api-docs)

export interface MatchResponse {
  id: number;
  round: string;
  startDate: string;
  stadium: string;
  homeTeam: string;
  homeTeamScore: number;
  awayTeam: string;
  awayTeamScore: number;
  reviewCount: number;
  matchRating: number;
}

export interface MatchResponses {
  matchResponses: MatchResponse[];
}

export interface HotReviewResponse {
  id: number;
  matchId: number;
  homeTeamName: string;
  awayTeamName: string;
  authorNickname: string;
  userId: number;
  content: string;
  likeCount: number;
  rating: number;
}

export interface HotReviewResponses {
  responses: HotReviewResponse[];
}

export interface UserResponse {
  id: number;
  nickname: string;
}

export interface TokenResponse {
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LikeToggleResponse {
  isLiked: boolean;
  totalLikeCount: number;
}

export interface MatchReviewCreateRequest {
  content?: string;
  point: number;
}

export interface MatchReviewCreateResponse {
  id: number;
}

export interface PlayerReviewCreateRequest {
  playerId: number;
  content?: string;
  point: number;
}

export interface PlayerReviewCreateResponse {
  id: number;
}
