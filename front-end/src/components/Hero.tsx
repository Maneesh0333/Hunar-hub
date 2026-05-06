import { Link } from "react-router-dom";
import { useHomeStats } from "../hooks/User/useHomeStats";
import { useAuthStore } from "../stores/authStore";

export default function Hero() {
  const { data: stats } = useHomeStats();
  const user = useAuthStore((state) => state.user);

  return (
    <section
      className="
        grid grid-cols-1 md:grid-cols-2 items-center
        px-16 max-md:px-6
        py-10 max-md:py-15 
        bg-[var(--warm-white)]
      "
    >
      {/* Left */}
      <div>
        {/* Eyebrow */}
        <div
          className="
            inline-flex items-center gap-2 mb-6
            px-4 py-1.5 rounded-full
            border border-[var(--clay)]/30
            bg-[var(--clay)]/10
            text-xs font-medium text-[var(--clay)]
          "
        >
          <span className="animate-pulse">●</span> 🌿 Empowering Local Artisans
          Across India
        </div>

        {/* Heading */}
        <h1
          className="
            font-playfair font-black
            text-[42px] md:text-[68px]
            leading-[1.1]
            text-[var(--ink)]
            mb-6
          "
        >
          Discover <br />
          <em className="italic text-[var(--clay)]">Skilled Hands,</em>
          <br />
          Near You
        </h1>

        {/* Description */}
        <p className="max-w-xl text-[17px] text-[var(--earth)] mb-10">
          Connect with verified local cobblers, tailors, potters, weavers &
          more. Support micro-entrepreneurs in your community.
        </p>

        {/* CTAs */}
        <div className="flex gap-4 flex-wrap mb-14">
          <Link
            to="/search"
            className="
              inline-flex items-center justify-center
              px-6 py-3 rounded-md
              text-sm font-semibold text-white
              bg-[var(--clay)]
              shadow-[0_4px_14px_rgba(196,99,42,0.35)]
              transition-all duration-200
              hover:bg-[var(--clay-dark)]
              hover:-translate-y-1
              cursor-pointer
            "
          >
            Browse Artisans →
          </Link>

          {!user && (
            <Link
              to="/auth"
              state={{ page: "signup", role: "Entrepreneur" }}
              className="
              px-6 py-3 rounded-md
              border border-[var(--khaki)]
              text-sm font-medium text-[var(--ink)]
              transition-all duration-200
              hover:border-[var(--clay)]
              hover:text-[var(--clay)]
              cursor-pointer
            "
            >
              List Your Skills (For Artisans)
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="flex md:gap-10 flex-wrap max-md:justify-between">
          {[
            [stats?.VerifiedArtisans || 0, "Verified Artisans"],
            [stats?.OrdersCompleted || 0, "Orders Completed"],
            [stats?.Categories || 0, "Categories"],
          ].map(([num, label]) => (
            <div key={label}>
              <div className="font-playfair text-3xl font-bold text-[var(--clay)]">
                {num}
              </div>
              <div className="text-xs text-[var(--earth)]">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Visual */}
      <div className="hidden md:flex justify-center">
        <img
          src="/images/artisan.avif"
          alt="Local artisan at work"
          loading="lazy"
          className="w-[320px] h-[400px] object-cover rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.2)] border-3 border-[rgba(196,98,42,0.29)]"
        />
      </div>
    </section>
  );
}
