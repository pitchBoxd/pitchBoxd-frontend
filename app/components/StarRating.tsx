import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export const StarRating = ({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRate,
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const displayRating = hoverRating ?? rating;

  const handleClick = (starIndex: number, isLeftHalf: boolean) => {
    if (!interactive || !onRate) return;
    const value = isLeftHalf ? starIndex + 0.5 : starIndex + 1;
    onRate(value);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeftHalf = e.clientX - rect.left < rect.width / 2;
    setHoverRating(isLeftHalf ? starIndex + 0.5 : starIndex + 1);
  };

  return (
    <div
      className="flex items-center gap-0.5"
      onMouseLeave={() => interactive && setHoverRating(null)}
    >
      {Array.from({ length: maxRating }, (_, i) => {
        const fillLevel =
          displayRating >= i + 1 ? "full" : displayRating >= i + 0.5 ? "half" : "empty";

        return (
          <div
            key={i}
            className={cn(
              "relative transition-transform duration-150",
              interactive && "cursor-pointer hover:scale-110"
            )}
            onMouseMove={(e) => handleMouseMove(e, i)}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const isLeftHalf = e.clientX - rect.left < rect.width / 2;
              handleClick(i, isLeftHalf);
            }}
          >
            {fillLevel === "full" && (
              <Star className={cn(sizeMap[size], "fill-accent text-accent")} />
            )}
            {fillLevel === "half" && (
              <div className="relative">
                <Star className={cn(sizeMap[size], "fill-none text-muted-foreground/30")} />
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star className={cn(sizeMap[size], "fill-accent text-accent")} />
                </div>
              </div>
            )}
            {fillLevel === "empty" && (
              <Star className={cn(sizeMap[size], "fill-none text-muted-foreground/30")} />
            )}
          </div>
        );
      })}
    </div>
  );
};
