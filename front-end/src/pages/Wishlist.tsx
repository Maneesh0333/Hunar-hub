import ArtisanCard from "../components/ArtisanCard";
import Spinner from "../components/Shared/Spinner";
import { useWishlist } from "../hooks/User/useWishlist";

export default function Wishlist() {
  const { data: wishlist, isLoading, isError, error } = useWishlist();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#FAF5ED] text-[#2C1A0E] space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-playfair font-black">Wishlist</h1>
        <p className="text-sm text-[#6B4A2D]">
          Artisans and services you’ve saved for later
        </p>
      </div>
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
    </div>
  );
}
