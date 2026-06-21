import { StarRating } from "./StarRating";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  review: {
    id: string | number;
    author: string;
    rating: number;
    text: string;
    likes: number;
    createdAt?: string;
    isLiked?: boolean;
    fanType?: "HOME" | "AWAY" | "NEUTRAL";
    isModified?: boolean;
  };
  onLikeToggle?: () => void;
}

const fanTypeLabel = {
  HOME: "홈팬",
  AWAY: "원정팬",
  NEUTRAL: "중립",
};

const fanTypeStyles = {
  HOME: "bg-destructive/10 text-destructive border-destructive/20",
  AWAY: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  NEUTRAL: "bg-secondary text-muted-foreground border-border",
};

export const ReviewCard = ({ review, onLikeToggle }: ReviewCardProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-display text-xs font-bold text-secondary-foreground">
            {review.author?.[0] || "?"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">{review.author}</p>
              {review.fanType && (
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded border font-semibold font-display", fanTypeStyles[review.fanType])}>
                  {fanTypeLabel[review.fanType]}
                </span>
              )}
            </div>
            {review.createdAt && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(review.createdAt).toLocaleDateString("ko-KR")}
              </p>
            )}
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>

      <p className="text-sm text-secondary-foreground leading-relaxed whitespace-pre-line">
        {review.text}
        {review.isModified && <span className="ml-1 text-[10px] text-muted-foreground/70">(수정됨)</span>}
      </p>

      <div className="flex items-center justify-between">
        <button
          onClick={onLikeToggle}
          disabled={!onLikeToggle}
          className={cn(
            "flex items-center gap-1.5 text-xs transition-colors py-1 px-2 rounded-md hover:bg-secondary",
            review.isLiked ? "text-rose-500 font-semibold" : "text-muted-foreground",
            onLikeToggle && "cursor-pointer"
          )}
        >
          <Heart className={cn("w-3.5 h-3.5", review.isLiked && "fill-rose-500 text-rose-500")} />
          <span>{review.likes}</span>
        </button>
      </div>
    </div>
  );
};
