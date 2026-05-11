export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "HunarHub gave me a way to reach customers beyond my neighbourhood. My earnings tripled in just three months — and I didn't need any tech knowledge to get started.",
      avatar: "R",
      name: "Ramesh Prajapati",
      role: "Potter · Jaipur",
    },
    {
      quote:
        "I found a cobbler who restored my grandfather's old shoes — something I thought was impossible. The whole booking process took two minutes. Incredible platform.",
      avatar: "A",
      name: "Arjun Mehta",
      role: "Customer · Delhi",
    },
    {
      quote:
        "As an admin, I can see the real impact. Verified artisans are getting consistent orders, reviews are building trust, and the community is growing organically every week.",
      avatar: "N",
      name: "Neha Gupta",
      role: "Platform Admin",
    },
  ];

  return (
    <section
      id="testimonials"
      className="px-16 max-md:px-6
        py-10 max-md:py-15 bg-[var(--warm-white)]"
    >
      {/* Header */}
      <p className="text-xs tracking-[0.3em] font-semibold uppercase text-[var(--clay)] mb-3">
        Real Stories
      </p>

      <h2 className="font-playfair text-3xl md:text-5xl font-black text-[var(--ink)]">
        Voices from Our <em className="italic text-[var(--clay)]">Community</em>
      </h2>

      {/* Grid */}
      <div className="grid gap-6 mt-14 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="relative bg-white rounded-2xl p-7
                       border border-[var(--clay)]/10"
          >
            {/* Quote mark */}
            <div
              className="absolute top-3 left-5 font-playfair text-6xl leading-none
                            text-[var(--clay)] opacity-20"
            >
              "
            </div>

            {/* Text */}
            <p className="mt-6 text-sm leading-relaxed text-[var(--earth-mid)]">
              {t.quote}
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 mt-6">
              <div
                className="w-11 h-11 rounded-full
                           bg-[var(--khaki)]
                           flex items-center font-semibold justify-center
                           text-lg"
              >
                {t.avatar}
              </div>

              <div>
                <div className="text-sm font-semibold text-[var(--ink)]">
                  {t.name}
                </div>
                <div className="text-xs text-[var(--clay)]">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
