import { Link } from "react-router-dom";
import { useSearchEntrepreneurs } from "../hooks/User/useSearchEntrepreneurs";
import ArtisanCard from "./ArtisanCard";
import Spinner from "./Shared/Spinner";

export default function FeaturedArtisans() {
  const { data, isLoading } = useSearchEntrepreneurs(
    "",
    "All",
    "Any",
    false,
    false,
    3,
  );

  const entrepreneurs =
    data?.pages.flatMap((page) => page.data.entrepreneurs) || [];

  if (isLoading) {
    return (
      <div className="min-h-60 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <section className="px-16 max-md:px-6 py-10 max-md:py-15 bg-[var(--cream)]">
      {/* Header */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-xs tracking-[0.3em] font-semibold uppercase text-[var(--clay)] mb-3">
            Top Rated
          </p>
          <h2 className="font-playfair text-3xl md:text-5xl font-black text-[var(--ink)]">
            Meet Our <em className="italic text-[var(--clay)]">Artisans</em>
          </h2>
        </div>

        <Link
          to="/search"
          className="inline-flex items-center gap-2 text-sm font-semibold
                     border border-[var(--clay)]/40 whitespace-nowrap 
                     px-4 py-2 rounded-md text-[var(--clay)]
                     hover:bg-[var(--clay)] hover:text-white transition"
        >
          View All →
        </Link>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {entrepreneurs.map((a) => (
          <ArtisanCard key={a._id} artisan={a} />
        ))}
      </div>
    </section>
  );
}
