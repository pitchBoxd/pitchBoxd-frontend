import { type Match, type Review } from "@/data/mockData";
import { RatingBadge } from "./RatingBadge";
import { StarRating } from "./StarRating";
import { ReviewCountdown } from "./ReviewCountdown";
import { Users, Flame, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  match: Match;
  onClick: (id: string) => void;
  featured?: boolean;
  reviews?: Review[] | null;
}

export const MatchCard = ({ match, onClick, featured, reviews }: MatchCardProps) => {
  return (
    <button
      onClick={() => onClick(match.id)}
      className={cn(
        "group w-full text-left rounded-lg border border-border bg-card transition-all duration-200 overflow-hidden flex flex-col",
        "hover:border-primary/40 hover:bg-surface-hover hover:shadow-lg hover:shadow-primary/5",
        featured && "border-primary/30 bg-gradient-to-br from-card to-pitch-dim/20 md:col-span-2"
      )}
    >
      <div className={cn("flex-1 w-full", featured ? "p-6 sm:p-8" : "p-5")}>
        {featured && (
          <span className="inline-block text-[10px] uppercase tracking-[0.2em] font-display text-pitch mb-4">
            🔥 MY TEAM MATCH
          </span>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-display">
              R{match.round} · {match.date}
            </span>
            {match.reviewEndTime && (
              <div className="mt-1">
                <ReviewCountdown deadline={match.reviewEndTime} />
              </div>
            )}
          </div>
          <RatingBadge rating={match.avgRating} />
        </div>

        {featured ? (
          <div className="flex items-center justify-between gap-6 py-6 my-2 border-y border-border/40">
            <div className="flex-1 flex flex-col items-center text-center">
              <span className="text-5xl mb-3">{match.homeTeamLogo}</span>
              <span className="font-display font-bold text-foreground text-base sm:text-xl truncate max-w-[120px] sm:max-w-none">
                {match.homeTeam}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1.5 shrink-0">
              <div className="flex items-center gap-4 font-display">
                <span className="text-4xl sm:text-5xl font-extrabold text-foreground">{match.homeScore}</span>
                <span className="text-muted-foreground text-xl">:</span>
                <span className="text-4xl sm:text-5xl font-extrabold text-foreground">{match.awayScore}</span>
              </div>
              <span className="text-[10px] text-pitch bg-pitch/10 px-2.5 py-0.5 rounded font-semibold tracking-wider">
                경기 종료
              </span>
            </div>
            <div className="flex-1 flex flex-col items-center text-center">
              <span className="text-5xl mb-3">{match.awayTeamLogo}</span>
              <span className="font-display font-bold text-foreground text-base sm:text-xl truncate max-w-[120px] sm:max-w-none">
                {match.awayTeam}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="flex-1 text-right">
              <p className="font-display font-semibold text-foreground text-sm truncate">
                {match.homeTeam}
              </p>
            </div>

            <div className="flex items-center gap-2 font-display">
              <span className="text-2xl font-bold text-foreground">{match.homeScore}</span>
              <span className="text-muted-foreground text-sm">:</span>
              <span className="text-2xl font-bold text-foreground">{match.awayScore}</span>
            </div>

            <div className="flex-1 text-left">
              <p className="font-display font-semibold text-foreground text-sm truncate">
                {match.awayTeam}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
          <span>{match.venue}</span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {match.totalRatings.toLocaleString()}
          </span>
        </div>
      </div>

      {reviews && reviews.length > 0 && (
        <div className="w-full border-t border-border bg-muted/15 text-xs divide-y divide-border/60">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 space-y-2 hover:bg-muted/20 transition-colors duration-200"
            >
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="font-semibold text-pitch flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  가장 핫한 한줄평
                </span>
                <span className="font-medium text-foreground">{rev.author}</span>
              </div>
              <p className="text-secondary-foreground leading-relaxed line-clamp-2">
                "{rev.text}"
              </p>
              <div className="flex items-center justify-between pt-1">
                <StarRating rating={rev.rating} size="sm" />
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                  <span className="text-rose-500/90 font-semibold">{rev.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </button>
  );
};

