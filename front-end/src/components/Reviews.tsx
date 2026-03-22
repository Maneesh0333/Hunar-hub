import RatingSummary from "./RatingSummary";
import ReviewsContainer from "./ReviewsContainer";
import { StarRating } from "./StarRating";

export type Review = {
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  service: string;
};

type ReviewsData = {
  average: number;
  total: number;
  breakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  reviews: Review[];
};

const reviewsData: ReviewsData = {
  average: 4.5,
  total: 138,
  breakdown: {
    5: 121,
    4: 12,
    3: 3,
    2: 1,
    1: 1,
  },
  reviews: [
    {
      name: "Priya Sharma",
      avatar: "👩",
      rating: 4,
      date: "3 days ago",
      text: "Rashida ji stitched my daughter's wedding blouse and it came out absolutely stunning. The fit was perfect and she even matched the embroidery thread exactly. Will definitely come back for the lehenga!",
      service: "Blouse Stitching",
    },
    {
      name: "Sana Mirza",
      avatar: "👩‍💼",
      rating: 5,
      date: "1 week ago",
      text: "She came home for measurements which was so convenient. The Chikankari dupatta she made was exquisite — people kept asking me where I got it from. 10/10 would recommend to everyone.",
      service: "Chikankari Work",
    },
    {
      name: "Arjun Mehta",
      avatar: "👨",
      rating: 4,
      date: "2 weeks ago",
      text: "Got my wife's salwar suit altered here after some weight loss. Quick turnaround — done in a day — and the stitching quality was great. Slight delay in communication but overall very happy.",
      service: "Alteration & Repair",
    },
  ],
};

type ReviewsProps = {
  title?: string;
  titleRequired?: boolean;
};

export default function Reviews({
  title = "⭐ Customer Reviews",
  titleRequired = true,
}: ReviewsProps) {
  const { average, total, breakdown, reviews } = reviewsData;

  return (
    <div className="bg-white rounded-2xl border border-[rgba(196,99,42,0.12)] p-6">
      {/* Title */}
      {titleRequired && (
        <h3 className="mb-6 text-xl font-bold flex items-center gap-2">{title}</h3>
      )}

      {/* Summary */}
      <RatingSummary average={average} total={total} breakdown={breakdown} />

      {/* Reviews list */}
      <ReviewsContainer reviews={reviews} />

      {/* Load more */}
      <button className="mt-6 w-full rounded-xl text-[var(--earth-mid)] border border-[rgba(196,99,42,0.12)] py-3 text-sm font-medium cursor-pointer transition-all duration-200">
        Load More Reviews (135 more)
      </button>
    </div>
  );
}
