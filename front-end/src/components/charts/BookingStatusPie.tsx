"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, Sector, ResponsiveContainer } from "recharts";

/* ---------------- TYPES ---------------- */

type StatusStat = {
  name: string;
  value: number;
};

type Props = {
  data: StatusStat[];
  total: number;
};

const COLORS = {
  Pending: "#F59E0B",
  Confirmed: "#3B82F6",
  Completed: "#22C55E",
  Cancelled: "#EF4444",
  Declined: "#6B7280",
};

export default function BookingStatusPie({ data, total }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeItem = activeIndex !== null ? data[activeIndex] : null;

  const displayValue = activeItem ? activeItem.value : total;
  const displayLabel = activeItem ? activeItem.name : "Total Bookings";

  return (
    <div className="relative flex-1 min-h-96 bg-white rounded-2xl border border-[rgba(196,99,42,0.12)] p-8">
      <h2 className="font-semibold mb-1">Bookings Status</h2>
      <p className="text-xs text-[var(--earth-light)] mb-3">
        This month · {total} total
      </p>

      <ResponsiveContainer width="100%" height="80%"  minHeight={300}>
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
                fill={COLORS[entry.name as keyof typeof COLORS] || "#ccc"}
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