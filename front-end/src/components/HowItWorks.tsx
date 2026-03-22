const steps = [
  {
    num: "01",
    icon: "🔍",
    title: "Browse & Discover",
    desc: "Search local artisans by skill, location, or rating. Read reviews, check availability, and compare prices before booking."
  },
  {
    num: "02",
    icon: "📋",
    title: "Book or Order",
    desc: "Place a service request or product order directly. Describe your requirements and choose a time slot that works for you."
  },
  {
    num: "03",
    icon: "✅",
    title: "Get It Done",
    desc: "The artisan accepts your request and delivers. Pay securely and leave a review to help the community grow."
  }
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-[var(--earth)] px-6 md:px-16 py-24">
      {/* Header */}
      <p className="text-xs tracking-[0.3em] font-semibold uppercase text-[var(--clay-light)] mb-3">
        Simple Process
      </p>

      <h2 className="font-playfair text-3xl md:text-5xl font-black text-[var(--cream)] leading-tight">
        How <em className="italic text-[var(--clay)]">HunarHub</em>
        <br />
        Works
      </h2>

      {/* Grid */}
      <div className="flex flex-col gap-5 mt-15">
        {steps.map((step) => (
          <div
            key={step.num}
            className="relative rounded-2xl p-9
                       bg-white/5 border border-white/10
                       hover:bg-white/10 transition"
          >
            {/* Big number */}
            <div className="absolute top-4 right-6 font-playfair text-7xl font-black text-[var(--clay)]/20 leading-none">
              {step.num}
            </div>

            <span className="block text-4xl mb-5">{step.icon}</span>

            <h3 className="font-playfair text-xl font-bold text-white mb-3">
              {step.title}
            </h3>

            <p className="text-sm leading-relaxed text-white/55">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}