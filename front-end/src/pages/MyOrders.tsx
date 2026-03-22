import { useState } from "react";

const tabs = [
  { label: "All", count: 18 },
  { label: "Active", count: 2 },
  { label: "Completed", count: 15 },
  { label: "Cancelled", count: 1 },
];

export default function MyOrders() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="flex-1 p-6 text-[#2C1A0E] space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-playfair font-black">My Orders</h1>
        <p className="text-sm text-[#6B4A2D]">18 total orders</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition
              ${
                activeTab === tab.label
                  ? "bg-[var(--clay)] text-white border-[var(--clay)]"
                  : "bg-white text-[#6B4A2D] border-[rgba(196,99,42,0.2)] hover:border-[var(--clay)]"
              }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Order Card */}
      <div className="flex gap-5 items-center bg-[var(--cream)] rounded-2xl border border-[rgba(196,99,42,0.12)] p-5">
        <div className="w-15 h-15 rounded-2xl bg-[#D4B896] flex items-center justify-center text-3xl shadow">
          🧵
        </div>

        <div className="flex flex-col gap-3 flex-1">
          <div className="flex justify-between flex-1">
            <div className="flex flex-col gap-2">
              <div>
                <h3 className="font-semibold text-[16px]">
                  Bridal Lehenga Stitching
                </h3>
                <p className="text-[11px] text-[#6B4A2D]">
                  Rashida Begum · Master Tailor · Hazratganj
                </p>
              </div>

              <span className="px-3 py-0.5 text-[10px] border border-[rgba(196,99,42,0.12)] w-fit rounded-full">
                #HH-1840
              </span>
              <span className="px-3 py-0.5 text-[10px] border border-[rgba(196,99,42,0.12)] w-fit rounded-full">
                Booked 24 Feb
              </span>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1 items-end">
                <span className="px-3 py-0.5 text-[11px] font-semibold w-fit rounded-full bg-blue-100 text-blue-700">
                  🔵 In Progress
                </span>

                <div className="flex flex-col items-end">
                  <div className="font-bold text-xl">₹3,200</div>
                  <div className="text-[11px] text-[#6B4A2D]">
                    Due 4 Mar 2026
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 text-sm rounded-lg border border-[rgba(196,99,42,0.3)] hover:border-[var(--clay)]">
                  💬 Message
                </button>

                <button className="px-5 py-2 text-sm font-semibold rounded-lg bg-[var(--clay)] text-white hover:bg-[var(--clay-dark)]">
                  Track →
                </button>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="relative flex items-center text-xs text-[#6B4A2D] w-fit">
            <div className="absolute top-1.5 w-full px-8">
              <div className="relative">
                <div className="absolute top-0 left-0 h-1 bg-green-600 w-[60%] z-10" />
                <div className="absolute top-0 left-0 h-1 bg-[var(--khaki)] w-full" />
              </div>
            </div>

            {["Booked", "Confirmed", "In Work", "Ready", "Delivered"].map(
              (step, index) => (
                <div
                  key={step}
                  className="flex flex-col w-16 items-center gap-2"
                >
                  <span
                    className={`z-10 w-4 h-4 rounded-full flex items-center justify-center
                    ${index < 3 ? "bg-green-600 text-white" : "bg-[#E5D5C3]"}`}
                  >
                    ✓
                  </span>
                  <span>{step}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
