function AchievementsCard() {
  return (
    <section className="bg-white rounded-2xl border border-[rgba(196,99,42,0.12)] p-6">
      <h2 className="font-serif text-lg font-bold flex items-center gap-2">
        Achievements 🏆
      </h2>

      <div className="mt-4 space-y-3">
        <Achievement
          icon="🥇"
          title="Top Artisan — Lucknow"
          subtitle="Top 5% by rating · Feb 2026"
          bg="bg-[#FFF7ED]"
        />

        <Achievement
          icon="⚡"
          title="Fast Responder"
          subtitle="Average reply time under 30 min"
          bg="bg-[#F0FDF4]"
        />

        <Achievement
          icon="💯"
          title="Completion Streak"
          subtitle="12 orders completed in a row"
          bg="bg-[#EFF6FF]"
        />

        <Achievement
          icon="✨"
          title="840+ Orders Milestone"
          subtitle="Lifetime orders since joining 2022"
          bg="bg-[#FFF5F5]"
        />
      </div>
    </section>
  );
}

export default AchievementsCard;

/* ── Small achievement row ── */
function Achievement({
  icon,
  title,
  subtitle,
  bg,
}: {
  icon: string;
  title: string;
  subtitle: string;
  bg: string;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-[rgba(196,99,42,0.12)] p-4 ${bg}`}
    >
      <div className="text-xl">{icon}</div>

      <div>
        <div className="text-sm font-semibold text-[#2C1A0E]">
          {title}
        </div>
        <div className="text-xs text-[#6B4A2D] mt-0.5">
          {subtitle}
        </div>
      </div>
    </div>
  );
}