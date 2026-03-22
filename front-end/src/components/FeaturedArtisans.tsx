import ArtisanCard from "./ArtisanCard";

export type Artisan = {
  name: string;
  skill: string;
  tags: string[];   
  location: string;
  avatar: string;      
  badge: string;        
  rating: number;       
  reviews: number;
  price: string;        
  unit: string;         
  gradient: string;     
};

export const artisans: Artisan[] = [
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

export default function FeaturedArtisans() {
  return (
    <section className="px-6 md:px-16 py-20 bg-[var(--cream)]">
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

        <a
          href="#"
          className="inline-flex items-center gap-2 text-sm font-semibold
                     border border-[var(--clay)]/40
                     px-4 py-2 rounded-md text-[var(--clay)]
                     hover:bg-[var(--clay)] hover:text-white transition"
        >
          View All →
        </a>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {artisans.map((a, index) => (
          <ArtisanCard key={index} artisan={a}/>
        ))}
      </div>
    </section>
  );
}
