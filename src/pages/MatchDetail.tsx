import { useParams, useNavigate } from "react-router-dom";
import { matches, matchPlayers, matchReviews } from "@/data/mockData";
import { Header } from "@/components/Header";
import { RatingBadge } from "@/components/RatingBadge";
import { PlayerRatingCard } from "@/components/PlayerRatingCard";
import { ReviewCard } from "@/components/ReviewCard";
import { StarRating } from "@/components/StarRating";
import { ArrowLeft, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const MatchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const match = matches.find((m) => m.id === id);
  const players = matchPlayers[id || ""] || [];
  const reviews = matchReviews[id || ""] || [];
  const [userRating, setUserRating] = useState(0);

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        경기를 찾을 수 없습니다.
      </div>
    );
  }

  const starters = players.filter((p) => !p.isSubstitute);
  const subs = players.filter((p) => p.isSubstitute);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-5xl mx-auto px-4 py-8">
        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          전체 경기
        </button>

        {/* Match Header */}
        <div className="rounded-xl border border-border bg-card p-8 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-display">
              K리그 1 · R{match.round} · {match.date}
            </span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              {match.totalRatings.toLocaleString()}명 평가
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 my-6">
            <div className="flex-1 text-right">
              <p className="font-display font-bold text-xl text-foreground">
                {match.homeTeam}
              </p>
              <p className="text-xs text-muted-foreground mt-1">HOME</p>
            </div>

            <div className="flex items-center gap-3 font-display">
              <span className="text-4xl font-bold text-foreground">{match.homeScore}</span>
              <span className="text-xl text-muted-foreground">:</span>
              <span className="text-4xl font-bold text-foreground">{match.awayScore}</span>
            </div>

            <div className="flex-1 text-left">
              <p className="font-display font-bold text-xl text-foreground">
                {match.awayTeam}
              </p>
              <p className="text-xs text-muted-foreground mt-1">AWAY</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <RatingBadge rating={match.avgRating} size="lg" />
            <span className="text-sm text-muted-foreground">평균 평점</span>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-3">
            📍 {match.venue}
          </p>
        </div>

        {/* Rate this match */}
        <div className="rounded-xl border border-border bg-card p-6 mb-8">
          <h2 className="font-display font-semibold text-foreground mb-4">이 경기를 평가하세요</h2>
          <div className="flex items-center gap-4">
            <StarRating rating={userRating} size="lg" interactive onRate={setUserRating} />
            {userRating > 0 && (
              <span className="font-display font-bold text-accent text-2xl">
                {userRating}/10
              </span>
            )}
          </div>
          {userRating > 0 && (
            <div className="mt-4 space-y-3">
              <textarea
                placeholder="리뷰를 작성해주세요... (선택)"
                className="w-full rounded-md border border-border bg-secondary p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none h-24"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-display">
                평가 제출
              </Button>
            </div>
          )}
        </div>

        {/* Player Ratings */}
        {players.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display font-semibold text-foreground mb-4">
              선수 평점
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {starters.map((player) => (
                <PlayerRatingCard key={player.id} player={player} />
              ))}
            </div>
            {subs.length > 0 && (
              <>
                <p className="text-xs text-muted-foreground font-display mt-4 mb-2 uppercase tracking-wider">
                  교체 선수
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {subs.map((player) => (
                    <PlayerRatingCard key={player.id} player={player} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Reviews */}
        <div>
          <h2 className="font-display font-semibold text-foreground mb-4">
            리뷰 ({reviews.length})
          </h2>
          <div className="space-y-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MatchDetail;
