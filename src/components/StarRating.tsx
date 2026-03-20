import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

const sizeMap = {
  sm: "w-3.5 h-3.5",
  md: "w-5 h-5",
  lg: "w-7 h-7",
};

export const StarRating = ({
  rating,
  maxRating = 10,
  size = "md",
  interactive = false,
  onRate,
}: StarRatingProps) => {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }, (_, i) => {
        const filled = i < Math.round(rating);
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => onRate?.(i + 1)}
            className={cn(
              "transition-colors duration-150",
              interactive && "cursor-pointer hover:scale-110",
              !interactive && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeMap[size],
                filled
                  ? "fill-accent text-accent"
                  : "fill-none text-muted-foreground/30"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
