import ReviewCard from "./ReviewCard";
import type { ReviewUI } from "./Reviews";

type ReviewsContainerProps = {
  reviews: ReviewUI[];
};

function ReviewsContainer({ reviews }: ReviewsContainerProps) {
  return (
    <>
      {reviews.length > 0 ? (
        <div className="mt-8 space-y-6">
          {reviews.map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>
      ) : (
        <div className="flex h-50 text-sm items-center justify-center">
          No reviews yet
        </div>
      )}
    </>
  );
}

export default ReviewsContainer;
