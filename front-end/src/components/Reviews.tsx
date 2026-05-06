import { useInfiniteReviews } from "../hooks/User/useReviews";
import ErrorState from "../pages/ErrorState";
import { useAuthStore } from "../stores/authStore";
import RatingSummary from "./RatingSummary";
import ReviewsContainer from "./ReviewsContainer";
import Spinner from "./Shared/Spinner";

export type ReviewUI = {
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  service: string;
};

type ReviewsProps = {
  title?: string;
  titleRequired?: boolean;
  entrepreneurId?: string;
};

export default function Reviews({
  title = "⭐ Customer Reviews",
  titleRequired = true,
  entrepreneurId,
}: ReviewsProps) {
  const user = useAuthStore((state) => state.user);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useInfiniteReviews(entrepreneurId ? entrepreneurId : user?.id);

  // 🔹 Flatten all pages
  const allReviews = data?.pages.flatMap((page) => page.reviews) ?? [];

  // 🔹 Backend stats (no frontend calculation needed now ✅)
  const average = data?.pages[0]?.average ?? 0;
  const total = data?.pages[0]?.total ?? 0;
  const breakdown = data?.pages[0]?.breakdown ?? {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  // 🔹 Map API → UI format
  const reviews: ReviewUI[] = allReviews.map((r) => ({
    name: r.customer.name,
    avatar: "👤", // replace later with real avatar
    rating: r.rating,
    date: new Date(r.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    }),
    text: r.comment,
    service: r.service.title,
  }));

  if (isLoading)
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner />
      </div>
    );

  if (isError) {
    return (
      <ErrorState
        message="Failed to load reviews"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }

  if (allReviews.length === 0)
    return (
      <div className="flex h-full items-center justify-center">
        No reviews yet
      </div>
    );

  return (
    <div className="bg-white rounded-2xl border border-[rgba(196,99,42,0.12)] p-6">
      {/* Title */}
      {titleRequired && (
        <h3 className="mb-6 text-xl font-bold flex items-center gap-2">
          {title}
        </h3>
      )}

      {/* Summary */}
      <RatingSummary average={average} total={total} breakdown={breakdown} />

      {/* Reviews list */}
      <ReviewsContainer reviews={reviews} />

      {/* Load more */}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-6 w-full rounded-xl text-[var(--earth-mid)] border border-[rgba(196,99,42,0.12)] py-3 text-sm font-medium transition-all duration-200 hover:bg-[var(--cream)]"
        >
          {isFetchingNextPage
            ? "Loading..."
            : `Load More Reviews (${Math.max(total - reviews.length, 0)} more)`}
        </button>
      )}
    </div>
  );
}
