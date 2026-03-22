import ReviewCard from "./ReviewCard";
import type { Review } from "./Reviews";

type ReviewsContainerProps = {
  reviews: Review[];
};

function ReviewsContainer({reviews}: ReviewsContainerProps) {
  return (
    <div className="mt-8 space-y-6">
      {reviews.map((review, i) => (
        <ReviewCard key={i} review={review} />
      ))}
    </div>
  );
}

export default ReviewsContainer;
