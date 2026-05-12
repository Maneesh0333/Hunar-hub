import { Link, useNavigate } from "react-router-dom";
import { useAllCategories } from "../hooks/Admin/useCategories";
import { useState } from "react";
import Spinner from "./Shared/Spinner";

export default function Categories() {
  const { data: categories = [], isLoading } = useAllCategories();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  return (
    <section
      id="categories"
      className="px-16 max-md:px-6
        py-10 max-md:py-15  bg-[var(--cream)]"
    >
      {/* Header */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-xs tracking-[0.3em] font-semibold uppercase text-[var(--clay)] mb-3">
            Explore Skills
          </p>
          <h2 className="font-playfair text-3xl md:text-5xl font-black text-[var(--ink)] leading-tight">
            Find the <em className="italic text-[var(--clay)]">Right Craft</em>
          </h2>
        </div>

        <Link
          to="/search"
          className="inline-flex items-center gap-2 text-sm font-semibold
                     border border-[var(--clay)]/40
                     px-4 py-2 rounded-md text-[var(--clay)]
                     hover:bg-[var(--clay)] hover:text-white transition"
        >
          View All →
        </Link>
      </div>

      {/* Search Bar */}
      <form className="mt-6 flex bg-white rounded-xl overflow-hidden shadow-xl">
        <input
          onClick={() => navigate("/search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by skill or name…"
          className="flex-1 px-5 py-4 text-sm outline-none"
        />
      </form>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-96">
          <Spinner />
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-14">
          {categories.map(({ icon, name, _id }) => (
            <Link
              to={"/search"}
              state={{ category: _id }}
              key={name}
              className="group bg-white border border-[var(--clay)]/20
                       rounded-2xl px-4 py-6 text-center
                       transition cursor-pointer
                       hover:-translate-y-1
                       hover:border-[var(--clay)]
                       hover:bg-[var(--cream)]
                       hover:shadow-xl hover:shadow-[var(--clay)]/20
                       focus:outline-none
                       focus-visible:ring-2 focus-visible:ring-[var(--clay)]/40"
            >
              <span className="block text-4xl mb-3 transition group-hover:scale-110">
                {icon}
              </span>
              <div className="text-sm font-semibold text-[var(--earth)]">
                {name}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-60">
          No categoryes Yet
        </div>
      )}
    </section>
  );
}
