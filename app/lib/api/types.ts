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
  reviewEndTime?: string;
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
  favoriteTeamId?: number | null;
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

export interface MatchReviewUpdateRequest {
  content?: string;
  point: number;
}

export interface MatchReviewUpdateResponse {
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

export interface PlayerReviewUpdateRequest {
  content?: string;
  point: number;
}

export interface PlayerReviewUpdateResponse {
  id: number;
}

export interface HomeMatchResponse {
  matchResponse: MatchResponse;
  hotReviews: HotReviewResponse[];
}

export interface HomeResponses {
  responses: HomeMatchResponse[];
}

export interface TeamResponse {
  id: number;
  teamName: string;
}

export interface TeamResponses {
  teamResponses: TeamResponse[];
}

export interface TeamDetailResponse {
  id: number;
  name: string;
  stadium: string;
  followerCount: number;
}

export interface TeamDetailResponses {
  teamDetailResponses: TeamDetailResponse[];
}

export interface LineupResponse {
  playerId: number;
  playerName: string;
  backNumber: number;
  averageRating: number;
  status: "STARTER" | "SUBSTITUTED_IN" | "BENCH";
}

export interface LineupResponses {
  responses: LineupResponse[];
}

export interface MatchDetailResultResponse {
  seasonName: string;
  round: string;
  startTime: string;
  location: string;
  homeTeamName: string;
  homeScore: number;
  homeLineups: LineupResponses;
  awayTeamName: string;
  awayScore: number;
  awayLineups: LineupResponses;
  reviewEndTime?: string;
}

export interface MyMatchReviewResponse {
  reviewId: number;
  comment?: string;
  rating: number;
  isModified?: boolean;
  likeCount?: number;
  isLiked?: boolean;
}

export interface MyPlayerReviewResponse {
  playerReviewId: number;
  playerId: number;
  comment?: string;
  rating: number;
  isModified?: boolean;
}

export interface MatchDetailPersonalResponse {
  isEvaluated: boolean;
  myMatchReview: MyMatchReviewResponse | null;
  myPlayerReviews: MyPlayerReviewResponse[];
}

export interface MatchDetailMatchReviewResponse {
  reviewId: number;
  authorId: number;
  authorNickname: string;
  point: number;
  content?: string;
  likeCount: number;
  isLiked: boolean;
  fanType: "HOME" | "AWAY" | "NEUTRAL";
  isModified?: boolean;
}

export interface MatchDetailMatchReviewResponses {
  responses: MatchDetailMatchReviewResponse[];
}

export interface MatchReviewDetailResponse {
  reviewId: number;
  nickname: string;
  point: number;
  content?: string;
  likeCount: number;
  isLiked: boolean;
  isOwner: boolean;
  fanType: "HOME" | "AWAY" | "NEUTRAL";
  createdAt: string;
  profileImage?: string;
  isModified?: boolean;
}

export interface MatchReviewSliceResponse {
  reviews: MatchReviewDetailResponse[];
  hasNext: boolean;
  nextCursorId?: number;
  nextCursorLikeCount?: number;
}

export interface HighlightPlayerResponse {
  playerId: number;
  name: string;
  averageRating: number;
}

export interface MatchHighlightsResponse {
  mom?: HighlightPlayerResponse | null;
  top3: HighlightPlayerResponse[];
}

export interface MatchDetailStatsResponse {
  totalAverage: number;
  homeAverage: number;
  awayAverage: number;
  distributionMap: Record<string, number>;
  highlights: MatchHighlightsResponse;
  homePlayerAverage?: number;
  awayPlayerAverage?: number;
  homeCount?: number;
  awayCount?: number;
  neutralCount?: number;
}

export interface PlayerReviewDetailResponse {
  id: number;
  nickname: string;
  favoriteTeamName: string | null;
  point: number;
  content: string | null;
  fanType: "HOME" | "AWAY" | "NEUTRAL" | string;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface PlayerReviewSliceResponse {
  reviews: PlayerReviewDetailResponse[];
  nextCursorId: number | null;
  nextCursorLikeCount: number | null;
  hasNext: boolean;
}

export interface SeasonResponse {
  id: number;
  name: string;
}

export interface SeasonResponses {
  seasonResponses: SeasonResponse[];
}
