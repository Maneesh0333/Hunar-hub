import ArtisanCard from "../components/ArtisanCard";
import { artisans } from "../components/FeaturedArtisans";

export default function Wishlist() {
  return (
    <div className="flex-1 p-6 bg-[#FAF5ED] text-[#2C1A0E] space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-playfair font-black">Wishlist</h1>
        <p className="text-sm text-[#6B4A2D]">
          Artisans and services you’ve saved for later
        </p>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {artisans.map((a, index) => (
          <ArtisanCard key={index} artisan={a} />
        ))}
      </div>
    </div>
  );
}
