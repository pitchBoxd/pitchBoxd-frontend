import { useParams, useNavigate } from "react-router";
import { Header } from "@/components/Header";
import { ReviewCard } from "@/components/ReviewCard";
import { ArrowLeft, Calendar, MapPin, MessageSquare, SlidersHorizontal } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { findTeam } from "@/lib/adapters/match";
import {
  useMatchResultData,
  useMatchReviewsInfinite,
  useToggleMatchReviewLike,
} from "@/lib/queries/matches";
import { cn } from "@/lib/utils";

const MatchReviews = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, userId } = useAuth();
  const [sort, setSort] = useState<"LATEST" | "LIKE">("LIKE");

  // Handle both mock string IDs and numeric server IDs
  const matchId = useMemo(() => {
    return Number(id?.replace("match-", "")) || 0;
  }, [id]);

  const matchResultQuery = useMatchResultData(matchId);
  const matchReviewsQuery = useMatchReviewsInfinite(matchId, userId, sort, 10);
  const toggleMatchReviewLikeMutation = useToggleMatchReviewLike();

  const handleLikeToggle = (reviewId: number) => {
    if (!isLoggedIn || !userId) {
      navigate("/login");
      return;
    }
    toggleMatchReviewLikeMutation.mutate({
      matchReviewId: reviewId,
      userId,
    });
  };

  const matchData = matchResultQuery.data;
  const isLoadingMatch = matchResultQuery.isLoading;

  const reviews = useMemo(() => {
    return matchReviewsQuery.data?.pages.flatMap((page) => page.reviews) ?? [];
  }, [matchReviewsQuery.data]);

  const hasNextPage = matchReviewsQuery.hasNextPage;
  const isFetchingNextPage = matchReviewsQuery.isFetchingNextPage;
  const isLoadingReviews = matchReviewsQuery.isLoading;

  const formattedDate = matchData?.startTime
    ? new Date(matchData.startTime).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
      })
    : "";

  const homeTeam = matchData ? findTeam(matchData.homeTeamName) : null;
  const awayTeam = matchData ? findTeam(matchData.awayTeamName) : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(`/match/${id}`)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6 cursor-pointer font-display"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          경기 상세 정보
        </button>

        {/* Small match context header */}
        {isLoadingMatch ? (
          <div className="h-24 bg-card rounded-lg border border-border animate-pulse mb-6"></div>
        ) : matchData ? (
          <div className="rounded-lg border border-border bg-card p-5 mb-8 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-[10px] text-muted-foreground font-display">
              <span className="uppercase tracking-wider font-semibold bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.2 rounded">
                R{matchData.round}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {matchData.location}
              </span>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{homeTeam?.logo ?? "⚽"}</span>
                  <span className="font-display font-bold text-sm">{matchData.homeTeamName}</span>
                  <span className="font-display font-black text-sm text-foreground ml-1">{matchData.homeScore}</span>
                </div>
                <span className="text-xs text-muted-foreground font-bold">:</span>
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-sm text-foreground mr-1">{matchData.awayScore}</span>
                  <span className="font-display font-bold text-sm">{matchData.awayTeamName}</span>
                  <span className="text-xl">{awayTeam?.logo ?? "⚽"}</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Filter and sorting section */}
        <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-pitch" />
            <h2 className="font-display font-semibold text-foreground text-sm">전체 리뷰</h2>
          </div>

          <div className="flex items-center gap-1 border border-border/80 rounded-md bg-secondary/30 p-0.5">
            <button
              onClick={() => setSort("LIKE")}
              className={cn(
                "px-3 py-1 text-[11px] font-display rounded transition-all cursor-pointer",
                sort === "LIKE"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              인기순
            </button>
            <button
              onClick={() => setSort("LATEST")}
              className={cn(
                "px-3 py-1 text-[11px] font-display rounded transition-all cursor-pointer",
                sort === "LATEST"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              최신순
            </button>
          </div>
        </div>

        {/* Reviews List */}
        {isLoadingReviews ? (
          <div className="space-y-3 py-12">
            <div className="h-28 bg-card rounded-lg border border-border animate-pulse"></div>
            <div className="h-28 bg-card rounded-lg border border-border animate-pulse"></div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.reviewId}
                review={{
                  id: review.reviewId,
                  author: review.nickname,
                  rating: review.point / 2,
                  text: review.content ?? "",
                  likes: review.likeCount,
                  isLiked: review.isLiked,
                  fanType: review.fanType,
                  createdAt: review.createdAt,
                  isModified: review.isModified,
                }}
                onLikeToggle={() => handleLikeToggle(review.reviewId)}
              />
            ))}

            {/* Pagination button */}
            {hasNextPage && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => matchReviewsQuery.fetchNextPage()}
                  disabled={isFetchingNextPage}
                  variant="outline"
                  className="w-full sm:w-auto font-display text-xs px-8 py-2 border-border/60 hover:bg-secondary cursor-pointer"
                >
                  {isFetchingNextPage ? "더 불러오는 중..." : "리뷰 더 가져오기"}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 rounded-lg bg-secondary/10 border border-border/40">
            <p className="text-xs text-muted-foreground">아직 등록된 리뷰가 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MatchReviews;
