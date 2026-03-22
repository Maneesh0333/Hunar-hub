import SearchBar from "./Shared/SearchBar";

const categories = [
  { icon: "👟", name: "Cobbler", count: 142 },
  { icon: "🧵", name: "Tailor", count: 389 },
  { icon: "🏺", name: "Potter", count: 98 },
  { icon: "🪢", name: "Weaver", count: 175 },
  { icon: "🔨", name: "Blacksmith", count: 64 },
  { icon: "🎨", name: "Painter", count: 203 },
  { icon: "🪡", name: "Embroiderer", count: 91 },
  { icon: "🪵", name: "Carpenter", count: 218 },
  { icon: "💈", name: "Barber", count: 310 },
  { icon: "🧹", name: "Basket Maker", count: 47 },
  { icon: "🪔", name: "Lamp Maker", count: 32 },
  { icon: "🧸", name: "Toy Maker", count: 58 }
];

export default function Categories() {
  return (
    <section id="categories" className="px-6 md:px-16 py-20 bg-[var(--cream)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <p className="text-xs tracking-[0.3em] font-semibold uppercase text-[var(--clay)] mb-3">
            Explore Skills
          </p>
          <h2 className="font-playfair text-3xl md:text-5xl font-black text-[var(--ink)] leading-tight">
            Find the <em className="italic text-[var(--clay)]">Right Craft</em>
          </h2>
        </div>

        <a
          href="#"
          className="inline-flex items-center gap-2 text-sm font-semibold
                     border border-[var(--clay)]/40
                     px-4 py-2 rounded-md text-[var(--clay)]
                     hover:bg-[var(--clay)] hover:text-white transition"
        >
          View All 120+ →
        </a>
      </div>

      {/* Search Bar */}
      <SearchBar triggerSearch={(query) => console.log(query)} />

      {/* <div
        className="mb-14 flex flex-col lg:flex-row
                   bg-white rounded-xl overflow-hidden
                   border border-[var(--clay)]/20
                   shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
      >
        <input
          type="text"
          placeholder="Search by skill, artisan name or location..."
          className="flex-1 px-5 py-4 text-[15px]
                     text-[var(--earth)]
                     placeholder:text-[var(--earth-mid)]
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
      </div> */}

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-14">
        {categories.map(({ icon, name, count }) => (
          <button
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
            <div className="text-xs text-[var(--earth-mid)] opacity-70 mt-1">
              {count} artisans
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}