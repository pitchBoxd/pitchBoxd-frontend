import { type Review } from "@/data/mockData";
import { StarRating } from "./StarRating";
import { Heart } from "lucide-react";

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-display text-xs font-bold text-secondary-foreground">
            {review.author[0]}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{review.author}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString("ko-KR")}
              {review.isModified && <span className="ml-1 text-muted-foreground/70">(수정됨)</span>}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>

      <p className="text-sm text-secondary-foreground leading-relaxed">
        {review.text}
      </p>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Heart className="w-3.5 h-3.5" />
        <span>{review.likes}</span>
      </div>
    </div>
  );
};
