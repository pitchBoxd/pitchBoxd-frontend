import { useState } from "react";
import { type Player } from "@/data/mockData";
import { RatingBadge } from "./RatingBadge";
import { StarRating } from "./StarRating";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface PlayerRatingCardProps {
  player: Player;
}

const positionColor: Record<string, string> = {
  GK: "text-accent",
  DF: "text-blue-400",
  MF: "text-pitch",
  FW: "text-destructive",
};

export const PlayerRatingCard = ({ player }: PlayerRatingCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <div
      className={cn(
        "rounded-md border border-border bg-card transition-colors",
        player.isSubstitute && "opacity-70"
      )}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 w-full p-3 text-left hover:bg-secondary/50 transition-colors rounded-md"
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
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform",
            expanded && "rotate-180"
          )}
        />
      </button>

      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-border space-y-3">
          <div className="flex items-center gap-3">
            <StarRating rating={rating} size="sm" interactive onRate={setRating} />
            {rating > 0 && (
              <span className="font-display font-bold text-accent text-sm">
                {rating}/5
              </span>
            )}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="한줄평을 남겨주세요..."
            className="w-full rounded-md border border-border bg-secondary p-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none h-16"
          />
          <Button
            size="sm"
            disabled={rating === 0}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-display text-xs"
          >
            평가 제출
          </Button>
        </div>
      )}
    </div>
  );
};
