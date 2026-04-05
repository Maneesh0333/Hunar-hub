import Categories from "../components/Categories";
import { Link } from "react-router-dom";

function UserHomePage() {
  return (
    <div className="flex flex-col">
      <section
        className="
      relative overflow-hidden
      grid grid-cols-1 lg:grid-cols-2 gap-10
        px-6 md:px-16
        py-12 md:py-16
        bg-gradient-to-br from-[var(--earth)] via-[var(--clay-dark)] to-[var(--clay)]
        text-[var(--warm-white)]
      "
      >
        {/* Left */}
        <div>
          {/* Eyebrow */}
          <div
            className="
            inline-flex items-center gap-2 mb-5
            px-4 py-1.5 rounded-full
            bg-white/10
            border border-white/20
            text-xs font-medium text-white
          "
          >
            <span className="animate-pulse">●</span> Your dashboard
          </div>

          {/* Heading */}
          <h1
            className="
            flex flex-col
            font-playfair font-black
            text-[36px] md:text-[52px]
            leading-[1.15]
            mb-4
          "
          >
            <em>Welcome back,</em>
            <span>
              <em className="italic text-[var(--clay)]">Priya ji</em>🙏
            </span>
          </h1>

          {/* Context */}
          <p className="max-w-xl text-[16px] text-white/85 mb-8">
            Your bridal lehenga is currently being stitched by{" "}
            <span className="font-semibold text-white">Rashida ji</span>. Two
            artisans have replied to your recent requests.
          </p>

          {/* Primary Actions */}
          <div className="flex gap-4 flex-wrap mb-10">
            <button
              className="
              inline-flex items-center justify-center
              px-6 py-3 rounded-md
              text-sm font-semibold
              bg-white text-[var(--clay-dark)]
              shadow-lg
              transition-all duration-200
              hover:-translate-y-1
            "
            >
              Track Orders →
            </button>

            <Link
              to={"/search"}
              className="
              px-6 py-3 rounded-md
              border border-white/30
              text-sm font-medium text-white
              transition-all duration-200
              hover:bg-white/10
            "
            >
              Browse Artisans
            </Link>

            <button
              className="
              px-6 py-3 rounded-md
              border border-white/30
              text-sm font-medium text-white
              relative
              transition-all duration-200
              hover:bg-white/10
            "
            >
              Messages
              <span className="ml-2 inline-flex items-center justify-center text-[10px] px-2 py-0.5 rounded-full bg-[#FFD6B0] text-[var(--clay-dark)]">
                2
              </span>
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-10 flex-wrap">
            {[
              ["0", "Orders Placed"],
              ["₹0", "Total Spent"],
              ["1,240", "Loyalty Points"],
            ].map(([value, label]) => (
              <div key={label}>
                <div className="font-playfair text-2xl font-bold text-white">
                  {value}
                </div>
                <div className="text-xs text-white/70">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Categories />
    </div>
  );
}

export default UserHomePage;
