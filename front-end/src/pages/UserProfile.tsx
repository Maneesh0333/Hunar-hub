export default function UserProfile() {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#FAF5ED] text-[#2C1A0E] space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-playfair font-black">👤 My Profile</h1>
        <p className="text-sm text-[#6B4A2D]">
          Manage your personal details and preferences
        </p>
      </div>

      {/* Profile Card */}
      <section className="bg-white rounded-2xl border border-[rgba(196,99,42,0.12)] p-6 flex gap-6 items-center">
        <div className="w-20 h-20 rounded-2xl bg-[var(--clay)] text-white flex items-center justify-center text-3xl">
          👩
        </div>

        <div className="flex-1">
          <div className="text-lg font-semibold">Priya Sharma</div>
          <div className="text-sm text-[#6B4A2D]">
            priya@email.com · +91 9XXXXXXXXX
          </div>
        </div>

        <button className="px-4 py-2 text-sm font-semibold rounded-lg border border-[var(--clay)] text-[var(--clay)] hover:bg-[var(--clay)] hover:text-white transition">
          Edit Profile
        </button>
      </section>

      {/* Personal Information */}
      <section className="bg-white rounded-2xl border border-[rgba(196,99,42,0.12)] p-6">
        <h2 className="font-serif font-bold text-lg mb-4">
          📄 Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {[
            ["Full Name", "Priya Sharma"],
            ["Email", "priya@email.com"],
            ["Phone", "+91 9XXXXXXXXX"],
            ["City", "Lucknow, UP"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="bg-[var(--cream)] rounded-xl p-4 border border-[rgba(196,99,42,0.12)]"
            >
              <div className="text-xs text-[#6B4A2D]">{label}</div>
              <div className="font-semibold">{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Preferences */}
      <section className="bg-white rounded-2xl border border-[rgba(196,99,42,0.12)] p-6">
        <h2 className="font-serif font-bold text-lg mb-4">
          ⚙️ Preferences
        </h2>

        <div className="space-y-4 text-sm">
          <label className="flex items-center justify-between">
            <span>Order Updates</span>
            <input type="checkbox" defaultChecked className="accent-[var(--clay)]" />
          </label>

          <label className="flex items-center justify-between">
            <span>Promotional Notifications</span>
            <input type="checkbox" className="accent-[var(--clay)]" />
          </label>

          <label className="flex items-center justify-between">
            <span>WhatsApp Alerts</span>
            <input type="checkbox" defaultChecked className="accent-[var(--clay)]" />
          </label>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="bg-white rounded-2xl border border-red-200 p-6">
        <h2 className="font-serif font-bold text-lg mb-3 text-red-600">
          🚨 Account
        </h2>

        <button className="text-sm font-semibold text-red-600 hover:underline">
          Deactivate Account
        </button>
      </section>
    </div>
  );
}