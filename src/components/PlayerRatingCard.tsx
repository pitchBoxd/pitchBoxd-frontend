import { type Player } from "@/data/mockData";
import { RatingBadge } from "./RatingBadge";
import { cn } from "@/lib/utils";

interface PlayerRatingCardProps {
  player: Player;
}

const positionColor: Record<string, string> = {
  GK: "text-accent",
  DF: "text-blue-400",
  MF: "text-pitch",
  FW: "text-red-400",
};

export const PlayerRatingCard = ({ player }: PlayerRatingCardProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md border border-border bg-card p-3 transition-colors hover:bg-surface-hover",
        player.isSubstitute && "opacity-70"
      )}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-secondary font-display text-xs font-bold text-secondary-foreground">
        {player.number}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {player.nameKr}
        </p>
        <div className="flex items-center gap-2 text-xs">
          <span className={cn("font-display font-semibold", positionColor[player.position] || "text-muted-foreground")}>
            {player.position}
          </span>
          <span className="text-muted-foreground">
            {player.totalRatings.toLocaleString()}명 평가
          </span>
        </div>
      </div>

      <RatingBadge rating={player.avgRating} size="sm" />
    </div>
  );
};
