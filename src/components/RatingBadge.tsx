import { cn } from "@/lib/utils";

interface RatingBadgeProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

const getRatingColor = (rating: number) => {
  if (rating >= 8) return "bg-primary text-primary-foreground";
  if (rating >= 6) return "bg-accent text-accent-foreground";
  if (rating >= 4) return "bg-muted text-muted-foreground";
  return "bg-destructive text-destructive-foreground";
};

const sizeClasses = {
  sm: "text-xs px-1.5 py-0.5 min-w-[2rem]",
  md: "text-sm px-2.5 py-1 min-w-[2.75rem] font-semibold",
  lg: "text-2xl px-4 py-2 min-w-[4rem] font-bold",
};

export const RatingBadge = ({ rating, size = "md" }: RatingBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md font-display tabular-nums",
        getRatingColor(rating),
        sizeClasses[size]
      )}
    >
      {rating.toFixed(1)}
    </span>
  );
};
