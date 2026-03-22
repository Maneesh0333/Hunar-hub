import { memo } from "react";

const MAX_STARS = 5 as const;

type StarRatingProps = Readonly<{
  rating: number;
  size?: "sm" | "md" | "lg";
  activeColor?: string;
  inactiveColor?: string;
}>;

const sizeMap = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
} as const;

export const StarRating = memo(function StarRating({
  rating,
  size = "sm",
  activeColor = "var(--gold)",
  inactiveColor = "#d1d5db",
}: StarRatingProps) {
  const clamped = Math.max(0, Math.min(MAX_STARS, rating));
  const percentage = (clamped / MAX_STARS) * 100;

  return (
    <div className={`relative inline-block ${sizeMap[size]}`}>
      {/* Inactive stars (background) */}
      <div style={{ color: inactiveColor }}>{"★★★★★"}</div>

      {/* Active stars (overlay) */}
      <div
        className="absolute top-0 left-0 overflow-hidden"
        style={{
          width: `${percentage}%`,
          color: activeColor,
        }}
      >
        {"★★★★★"}
      </div>
    </div>
  );
});
