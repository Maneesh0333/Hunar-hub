import { Link } from "react-router-dom";
import ArtisanCard from "../components/ArtisanCard";
import Spinner from "../components/Shared/Spinner";
import { useWishlist } from "../hooks/User/useWishlist";
import Header from "../components/Shared/Header";
import NoInternet from "./NoInternet";
import ErrorState from "./ErrorState";
import { useNetworkStatus } from "../hooks/Shared/useNetworkStatus";

export default function Wishlist() {
  const {
    data: wishlist,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useWishlist();
  const isOnline = useNetworkStatus();

  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load Wishlist"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#FAF5ED] text-[#2C1A0E] space-y-6">
      {/* Header */}

      <Link
        to="/home"
        className="text-sm bg-transparent text-[var(--clay-light)] hover:text-[var(--clay)] cursor-pointer"
      >
        ← Back to Home
      </Link>

      <Header
        title="Wishlist"
        description="Artisans and services you’ve saved for later"
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Spinner />
        </div>
      ) : (
        <>
          {wishlist && wishlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlist?.map((a) => (
                <ArtisanCard key={a._id} artisan={a} />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              No wishlist added
            </div>
          )}
        </>
      )}
    </div>
  );
}
