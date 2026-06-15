"use client";
import { useEffect, useRef, useState } from "react";
import ArtisanCard from "./ArtisanCard";
import NavBar from "./NavBar";
import Toggle from "./Toggle";
import SearchBar from "./Shared/SearchBar";
import { useSearchEntrepreneurs } from "../hooks/User/useSearchEntrepreneurs";
import { useAllCategories } from "../hooks/Admin/useCategories";
import Spinner from "./Shared/Spinner";
import { useMediaQuery } from "react-responsive";
import { SlidersHorizontal } from "lucide-react";
import { useLocation } from "react-router-dom";
import SEO from "./Shared/SEO";

const RatingFilterOption = [
  { key: "Any", label: "Any Rating" },
  { key: "4+", label: "4+ Stars" },
  { key: "3+", label: "3+ Stars" },
];

export default function SearchArtisansPage() {
  const location = useLocation();
  const filter = location.state;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(filter?.category || "All");
  const [rating, setRating] = useState("Any");
  const [availability, setAvailability] = useState({
    "Available Today": false,
    "Home Service": false,
  });

  const [open, setOpen] = useState(false);
  const mobile = useMediaQuery({ maxWidth: 768 });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSearchEntrepreneurs(
      search,
      category,
      rating,
      availability["Available Today"],
      availability["Home Service"],
    );

  const entrepreneurs =
    data?.pages.flatMap((page) => page.data.entrepreneurs) || [];

  const total = data?.pages?.[0]?.pagination?.total || 0;

  const { data: categories = [], isLoading: isLoadingCategories } =
    useAllCategories();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(el);

    return () => observer.unobserve(el);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <SEO
        title="Search Skilled Professionals | HunarHub"
        description="Browse verified electricians, plumbers, carpenters, painters, and other local professionals."
        url="https://hunar-hub-web.vercel.app/search"
      />
      <div className="min-h-screen bg-[var(--cream)] text-[var(--earth)]">
        <NavBar />

        <section className="px-10 pt-12 pb-6 max-md:px-6 bg-gradient-to-br from-[var(--earth)] to-[#3D1F09]">
          <h1 className="font-playfair text-white text-4xl font-black">
            Find{" "}
            <em className="italic text-[var(--clay-light)]">
              Skilled Artisans
            </em>{" "}
            Near You
          </h1>
          <p className="text-white/60 mt-2">
            Search from 2,400+ verified local craftspeople
          </p>

          <SearchBar triggerSearch={(query) => setSearch(query)} />
        </section>

        {/* ------------------------------ LAYOUT ------------------------------ */}
        <main className="flex max-md:flex-col">
          <div className="hidden px-10 py-3 max-md:px-6 border-b border-[rgba(196,99,42,0.12)] max-md:flex">
            <span
              onClick={() => setOpen((prev) => !prev)}
              className="border cursor-pointer border-[var(--border-1)] p-2 w-fit flex rounded-md"
            >
              <SlidersHorizontal size={20} />
            </span>
          </div>
          {/* ----------------------------- SIDEBAR ----------------------------- */}
          <aside
            className={`flex-1 sticky top-17 max-md:fixed max-md:h-full max-md:top-0 max-md:w-full h-[89vh] z-30 pb-20 bg-white border-r border-[rgba(196,99,42,0.12)] p-6 overflow-y-scroll transform duration-300 ${
              mobile
                ? open
                  ? "translate-y-[0%]"
                  : "translate-y-full"
                : "translate-y-0"
            }`}
            style={{ scrollbarWidth: "none" }}
          >
            <div className="w-full flex items-end justify-end-safe">
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="hidden max-md:flex px-2 py-1 border border-[var(--border-1)] rounded-md text-sm font-medium cursor-pointer text-[var(--ink)]/50 hover:text-[var(--ink)]/90"
              >
                ✕
              </button>
            </div>

            {isLoadingCategories ? (
              <div className="flex h-full">
                <Spinner />
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-xs font-bold text-[var(--clay)] uppercase mb-4">
                    Categories
                  </h3>

                  {[{ _id: "All", name: "All", icon: "♾️" }, ...categories].map(
                    (c) => (
                      <label
                        key={c._id}
                        className="group flex items-center justify-between gap-2 text-[14px] cursor-pointer border-b py-2 border-[rgba(196,99,42,0.12)]"
                      >
                        <span className="group-hover:translate-x-1 transition-all duration-200">
                          {c.icon} {c.name}
                        </span>
                        <div className="flex items-center justify-center gap-3">
                          <input
                            type="checkbox"
                            checked={category === c._id}
                            onChange={() => setCategory(c._id)}
                            className="accent-[var(--clay)] w-[18px] h-[18px] rounded-2xl"
                          />
                        </div>
                      </label>
                    ),
                  )}
                </div>

                {/* Rating */}
                <div>
                  <h3 className="text-xs font-bold text-[var(--clay)] uppercase mb-4 mt-8">
                    Rating
                  </h3>

                  <div className="flex flex-col gap-1">
                    {RatingFilterOption.map((item, index) => (
                      <label
                        key={index}
                        onClick={() => setRating(item.key)}
                        className={`${rating === item.key ? "bg-[var(--cream)]" : ""} flex items-center gap-3 hover:bg-[var(--cream)] text-[14px] text-[var(--earth-mid)] cursor-pointer py-2 px-4 rounded-lg`}
                      >
                        <span className="text-[#D4A847] text-sm">
                          {"★".repeat(5 - index)}
                        </span>
                        {item.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-[var(--clay)] uppercase mb-4 mt-8">
                    Availability
                  </h3>

                  <div className="flex flex-col gap-1">
                    {(["Available Today", "Home Service"] as const).map(
                      (item, index) => (
                        <label
                          key={index}
                          className="flex items-center justify-between gap-3 text-[14px] text-[var(--earth-mid)] cursor-pointer py-2 px-4 rounded-lg"
                        >
                          {item}
                          <Toggle
                            key={index}
                            availability={availability}
                            item={item}
                            setAvailability={setAvailability}
                          />
                        </label>
                      ),
                    )}
                  </div>
                </div>
              </>
            )}
          </aside>

          {/* ----------------------------- RESULTS ----------------------------- */}
          <section className="flex-3 flex flex-col min-h-60">
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <>
                {entrepreneurs && entrepreneurs.length > 0 ? (
                  <>
                    <div className="px-6 py-4 bg-[var(--warm)] border-b border-[rgba(196,99,42,0.12)]">
                      {search ? (
                        <>
                          Showing{" "}
                          <strong className="text-[var(--clay)]">
                            {total}
                          </strong>{" "}
                          Results for "{search}"
                        </>
                      ) : (
                        <>
                          Showing{" "}
                          <strong className="text-[var(--clay)]">
                            {total} artisans
                          </strong>{" "}
                        </>
                      )}
                    </div>

                    <div className="grid gap-6 grid-cols-2 max-sm:grid-cols-1 p-10 max-md:p-6">
                      {entrepreneurs.map((a) => (
                        <ArtisanCard key={a._id} artisan={a} />
                      ))}
                    </div>
                    <div ref={loadMoreRef} />

                    {isFetchingNextPage && (
                      <div className="flex justify-center py-4">
                        <Spinner />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    No Matching Result
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
