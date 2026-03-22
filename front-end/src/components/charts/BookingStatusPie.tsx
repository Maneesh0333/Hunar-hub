"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, Sector, ResponsiveContainer } from "recharts";

const data = [
  { name: "Confirmed", value: 45 },
  { name: "Pending", value: 20 },
  { name: "Cancelled", value: 10 },
];

const COLORS = {
  Confirmed: "#22C55E", // green
  Pending: "#F59E0B", // amber
  Cancelled: "#EF4444", // red
};

export default function BookingStatusDonut() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = data.reduce((acc, item) => acc + item.value, 0);

  const activeItem = activeIndex !== null ? data[activeIndex] : null;

  const displayValue = activeItem ? activeItem.value : total;
  const displayLabel = activeItem ? activeItem.name : "Total Bookings";

  return (
    <div className="relative flex-1 h-full bg-white rounded-2xl border border-[rgba(196,99,42,0.12)] p-8">
      <h2 className="font-semibold mb-1">Order Status</h2>
      <p className="text-xs text-[var(--earth-light)] mb-3">This month · 138 total</p>

      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius="70%"
            outerRadius="90%"
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            activeShape={(props) => (
              <Sector {...props} outerRadius={(props.outerRadius ?? 0) + 6} />
            )}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[entry.name as keyof typeof COLORS]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-10">
        <div className="text-2xl font-bold text-gray-900 transition-all duration-200">
          {displayValue}
        </div>
        <div className="text-xs text-gray-500 tracking-wide">
          {displayLabel}
        </div>
      </div>
    </div>
  );
}
