export default function AboutUs() {
  const highlights = [
    {
      title: "Empowering Local Talent",
      description:
        "HunarHub helps skilled artisans, craftsmen, and service providers connect directly with customers and grow their livelihood online.",
      icon: "🛠️",
    },
    {
      title: "Built on Trust",
      description:
        "Every artisan profile is verified to ensure customers can confidently discover authentic skills and reliable services nearby.",
      icon: "✅",
    },
    {
      title: "Growing Communities",
      description:
        "From potters and tailors to carpenters and painters, HunarHub supports local communities by creating sustainable opportunities.",
      icon: "🌱",
    },
  ];

  return (
    <section
      id="about"
      className="px-16 max-md:px-6 py-14 bg-[var(--cream)]"
    >
      {/* Header */}
      <p className="text-xs tracking-[0.3em] font-semibold uppercase text-[var(--clay)] mb-3">
        About HunarHub
      </p>

      <h2 className="font-playfair text-3xl md:text-5xl font-black text-[var(--ink)] leading-tight max-w-3xl">
        Connecting Skilled Hands with{" "}
        <em className="italic text-[var(--clay)]">People Who Need Them</em>
      </h2>

      <p className="mt-6 max-w-3xl text-[var(--earth-mid)] leading-relaxed text-sm md:text-base">
        HunarHub is a platform built to celebrate and support local talent.
        We believe skilled workers deserve visibility, dignity, and access to
        opportunities in the digital world. Whether it’s finding a trusted
        artisan nearby or helping craftsmen grow their business, HunarHub
        bridges the gap between communities and local expertise.
      </p>

      {/* Highlights */}
      <div className="grid gap-6 mt-14 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-7 border border-[var(--clay)]/10"
          >
            {/* Icon */}
            <div className="text-4xl">{item.icon}</div>

            {/* Title */}
            <h3 className="mt-5 text-lg font-bold text-[var(--ink)]">
              {item.title}
            </h3>

            {/* Description */}
            <p className="mt-3 text-sm leading-relaxed text-[var(--earth-mid)]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}