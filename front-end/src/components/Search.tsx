"use client";
import { useState } from "react";
import ArtisanCard from "./ArtisanCard";
import NavBar from "./NavBar";
import type { Artisan } from "./FeaturedArtisans";
import Toggle from "./Toggle";
import SearchBar from "./Shared/SearchBar";
import { useSearchEntrepreneurs } from "../hooks/User/useSearchEntrepreneurs";

/* ---------------------------------- DATA ---------------------------------- */
const categories = [
  {
    name: "🧵 Tailor",
    count: 389,
    selected: true,
  },
  {
    name: "👟 Cobbler",
    count: 142,
    selected: false,
  },
  {
    name: "🏺 Potter",
    count: 98,
    selected: false,
  },
  {
    name: "🪢 Weaver",
    count: 175,
    selected: false,
  },
  {
    name: "🔨 Blacksmith",
    count: 64,
    selected: false,
  },
  {
    name: "🎨 Painter",
    count: 203,
    selected: false,
  },
];

const artisans: Artisan[] = [
  {
    name: "Rashida Begum",
    skill: "Master Tailor",
    tags: ["Bridal wear", "Alteration", "Suits"],
    location: "Lucknow, UP",
    avatar: "🧵",
    badge: "✅ Verified",
    rating: 4.9,
    reviews: 138,
    price: "₹299",
    unit: "hr",
    gradient: "from-[var(--clay)] to-[var(--clay-light)]",
  },
  {
    name: "Ramesh Prajapati",
    skill: "Traditional Potter",
    tags: ["Custom Pots", "Decor Items", "Clay Repair"],
    location: "Jaipur, Rajasthan",
    avatar: "🏺",
    badge: "⭐ Top Pick",
    rating: 4.8,
    reviews: 94,
    price: "₹450",
    unit: "order",
    gradient: "from-[#2C5F6E] to-[#4A9BAE]",
  },
  {
    name: "Mohammed Iqbal",
    skill: "Cobbler & Leather Work",
    tags: ["Shoe Repair", "Polishing", "Custom Fit"],
    location: "Agra, UP",
    avatar: "👟",
    badge: "✅ Verified",
    rating: 4.7,
    reviews: 62,
    price: "₹199",
    unit: "visit",
    gradient: "from-[#5C4033] to-[#8B6B5A]",
  },
  {
    name: "Anita Devi",
    skill: "Handloom Weaver",
    tags: ["Sarees", "Dupattas", "Custom Weave"],
    location: "Varanasi, UP",
    avatar: "🪢",
    badge: "🌟 New",
    rating: 5.0,
    reviews: 18,
    price: "₹649",
    unit: "saree",
    gradient: "from-[#3A5C3E] to-[#6B9E70]",
  },
];

export default function SearchArtisansPage() {
  const [search, setSearch] = useState("");


  const { data: searchResult, isLoading } = useSearchEntrepreneurs(search);

  if(isLoading){
    return <div>Loading...</div>
  }

  console.log(search,"=====");
  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--earth)]">
      <NavBar />

      <section className="px-10 pt-12 pb-6 bg-gradient-to-br from-[var(--earth)] to-[#3D1F09]">
        <h1 className="font-playfair text-white text-4xl font-black">
          Find{" "}
          <em className="italic text-[var(--clay-light)]">Skilled Artisans</em>{" "}
          Near You
        </h1>
        <p className="text-white/60 mt-2">
          Search from 2,400+ verified local craftspeople
        </p>

        <SearchBar triggerSearch={(query) => setSearch(query)} />

        {/* Search Bar */}
        <div
          className="mt-5 flex flex-col lg:flex-row
                   bg-white rounded-xl overflow-hidden
                   border border-[var(--clay)]/20
                   shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
        >
          <input
            type="text"
            placeholder="Search by skill, artisan name or location..."
            className="flex-1 px-5 py-4 text-sm
                     text-[var(--earth)]
                     focus:outline-none"
          />

          <select
            className="px-5 py-4 text-sm text-[var(--earth-mid)]
                     bg-transparent cursor-pointer
                     border-t lg:border-t-0 lg:border-l
                     border-black/10 focus:outline-none"
          >
            <option>All Categories</option>
            <option>Cobbler</option>
            <option>Tailor</option>
            <option>Potter</option>
            <option>Weaver</option>
          </select>

          <select
            className="px-5 py-4 text-sm text-[var(--earth-mid)]
                     bg-transparent cursor-pointer
                     border-t lg:border-t-0 lg:border-l
                     border-black/10 focus:outline-none"
          >
            <option>Near Me</option>
            <option>Within 5km</option>
            <option>Within 20km</option>
            <option>Citywide</option>
          </select>

          <button
            className="px-7 py-4 text-[15px] font-semibold text-white
                     bg-[var(--clay)]
                     hover:bg-[var(--clay-dark)]
                     transition"
          >
            Search
          </button>
        </div>
      </section>

      {/* ------------------------------ LAYOUT ------------------------------ */}
      <main className="flex">
        {/* ----------------------------- SIDEBAR ----------------------------- */}
        <aside className="flex-1 sticky top-17 h-[89vh] pb-20 bg-white border-r border-[rgba(196,99,42,0.12)] p-6 overflow-y-scroll">
          <div>
            <h3 className="text-xs font-bold text-[var(--clay)] uppercase mb-4">
              Categories
            </h3>

            {categories.map((c, index) => (
              <label
                key={index}
                className="group flex items-center justify-between gap-2 text-[14px] cursor-pointer border-b py-2 border-[rgba(196,99,42,0.12)]"
              >
                <span className="group-hover:translate-x-1 transition-all duration-200">
                  {c.name}
                </span>
                <div className="flex items-center justify-center gap-3">
                  <span className="bg-[var(--cream)] px-2 py-0.5 text-[12px] rounded-2xl">
                    {c.count}
                  </span>
                  <input
                    type="checkbox"
                    checked={c.selected}
                    className="accent-[var(--clay)] w-[18px] h-[18px] rounded-2xl"
                  />
                </div>
              </label>
            ))}
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-xs font-bold text-[var(--clay)] uppercase mb-4 mt-8">
              Rating
            </h3>

            <div className="flex flex-col gap-1">
              {["4+ Stars", "3+ Stars", "Any Rating"].map((item, index) => (
                <label
                  key={index}
                  className="flex items-center gap-3 hover:bg-[var(--cream)] text-[14px] text-[var(--earth-mid)] cursor-pointer py-2 px-4 rounded-lg"
                >
                  <span className="text-[#D4A847] text-sm">
                    {"★".repeat(5)}
                  </span>
                  {item}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-[var(--clay)] uppercase mb-4 mt-8">
              Availability
            </h3>

            <div className="flex flex-col gap-1">
              {["Available Today", "Available This Week", "Home Service"].map(
                (item, index) => (
                  <label
                    key={index}
                    className="flex items-center justify-between gap-3 text-[14px] text-[var(--earth-mid)] cursor-pointer py-2 px-4 rounded-lg"
                  >
                    {item}
                    <Toggle />
                  </label>
                ),
              )}
            </div>
          </div>
        </aside>

        {/* ----------------------------- RESULTS ----------------------------- */}
        <section className="flex-3">
          <div className="px-6 py-4 bg-[var(--warm)] border-b border-[rgba(196,99,42,0.12)]">
            Showing <strong className="text-[var(--clay)]">24 artisans</strong>{" "}
            for "Tailor"
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 p-10">
            {searchResult?.entrepreneurs.map((a) => (
              <ArtisanCard key={a._id} artisan={a} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
