import { type Match } from "@/data/mockData";
import { RatingBadge } from "./RatingBadge";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  match: Match;
  onClick: (id: string) => void;
  featured?: boolean;
}

export const MatchCard = ({ match, onClick, featured }: MatchCardProps) => {
  return (
    <button
      onClick={() => onClick(match.id)}
      className={cn(
        "group w-full text-left rounded-lg border border-border bg-card p-5 transition-all duration-200",
        "hover:border-primary/40 hover:bg-surface-hover hover:shadow-lg hover:shadow-primary/5",
        featured && "border-primary/30 bg-gradient-to-br from-card to-pitch-dim/20"
      )}
    >
      {featured && (
        <span className="inline-block text-[10px] uppercase tracking-[0.2em] font-display text-pitch mb-3">
          🔥 이번 라운드 최고 경기
        </span>
      )}

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-muted-foreground font-display">
          R{match.round} · {match.date}
        </span>
        <RatingBadge rating={match.avgRating} />
      </div>

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

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{match.venue}</span>
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {match.totalRatings.toLocaleString()}
        </span>
      </div>
    </button>
  );
};
