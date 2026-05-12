import type { ReviewUI } from "./Reviews";
import { StarRating } from "./StarRating";


type ReviewCardProps = {
  review: ReviewUI;
};

function ReviewCard({review}: ReviewCardProps) {
  return (
    <div className="border-t border-[rgba(196,99,42,0.12)] pt-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 flex items-center shrink-0 font-semibold justify-center rounded-full bg-[var(--khaki)] text-lg">
          {review?.name[0]?.toUpperCase()}
        </div>

        <div className="flex-1">
          <div className="font-medium text-sm">{review.name}</div>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-[11px] text-[var(--earth-mid)]">
              {review.date}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-[var(--earth-mid)] text-[13px] leading-relaxed">
        {review.text}
      </p>

      <span className="inline-block mt-3 text-[11px] px-3 py-1 font-semibold rounded-full bg-[var(--cream)] text-[var(--clay)]">
        {review.service}
      </span>
    </div>
  );
}

export default ReviewCard;
