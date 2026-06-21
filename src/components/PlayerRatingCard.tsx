import { useState } from "react";
import { type Player, type PlayerReview, playerReviews } from "@/data/mockData";
import { RatingBadge } from "./RatingBadge";
import { StarRating } from "./StarRating";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ThumbsUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

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
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const reviews = playerReviews[player.id] || [];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center gap-3 w-full p-3 text-left rounded-md border border-border bg-card hover:bg-secondary/50 transition-colors",
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
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-secondary font-display text-sm font-bold text-secondary-foreground">
                {player.number}
              </div>
              <div>
                <DialogTitle className="text-foreground font-display">
                  {player.nameKr}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  <span className={cn("font-display font-semibold", positionColor[player.position] || "text-muted-foreground")}>
                    {player.position}
                  </span>
                  <span>·</span>
                  <span>{player.totalRatings.toLocaleString()}명 평가</span>
                </DialogDescription>
              </div>
              <div className="ml-auto">
                <RatingBadge rating={player.avgRating} size="lg" />
              </div>
            </div>
          </DialogHeader>

          {/* Rating form */}
          <div className="border border-border rounded-lg p-4 space-y-3 bg-secondary/30">
            <p className="text-sm font-display font-semibold text-foreground">평점 남기기</p>
            <div className="flex items-center gap-3">
              <StarRating rating={rating} size="md" interactive onRate={setRating} />
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
              className="w-full rounded-md border border-border bg-background p-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none h-16"
            />
            <Button
              size="sm"
              disabled={rating === 0}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-display text-xs"
            >
              평가 제출
            </Button>
          </div>

          {/* Other reviews */}
          {reviews.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-display font-semibold text-foreground">
                다른 팬들의 평가 ({reviews.length})
              </p>
              {reviews.map((review) => (
                <PlayerReviewItem key={review.id} review={review} />
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const PlayerReviewItem = ({ review }: { review: PlayerReview }) => (
  <div className="rounded-md border border-border bg-background p-3 space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-foreground">
        {review.author}
        {review.isModified && <span className="ml-1 font-normal text-muted-foreground/70">(수정됨)</span>}
      </span>
      <div className="flex items-center gap-1.5">
        <StarRating rating={review.rating} size="sm" />
        <span className="text-xs font-display font-bold text-accent">{review.rating}</span>
      </div>
    </div>
    <p className="text-sm text-muted-foreground">{review.text}</p>
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <ThumbsUp className="w-3 h-3" />
      <span>{review.likes}</span>
    </div>
  </div>
);
