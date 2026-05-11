"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Sector,
  ResponsiveContainer,
} from "recharts";

/* ---------------- TYPES ---------------- */

type StatusStat = {
  name: string;
  value: number;
};

type Props = {
  data: StatusStat[];
  total: number;
};

/* ---------------- COLORS ---------------- */

const COLORS = {
  Pending: "#F59E0B",
  Confirmed: "#3B82F6",
  Completed: "#22C55E",
  Cancelled: "#EF4444",
  Declined: "#6B7280",
};

export default function BookingStatusPie({ data, total }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  /* ---------------- CHECK DATA ---------------- */

  const hasData = data.some((item) => item.value > 0);

  const chartData = hasData
    ? data
    : [{ name: "Empty", value: 1 }];

  const activeItem =
    hasData && activeIndex !== null
      ? data[activeIndex]
      : null;

  const displayValue = hasData
    ? activeItem
      ? activeItem.value
      : total
    : 0;

  const displayLabel = hasData
    ? activeItem
      ? activeItem.name
      : "Total Bookings"
    : "No Bookings";

  return (
    <div className="relative flex-1 min-h-96 bg-white rounded-2xl border border-[rgba(196,99,42,0.12)] p-8">
      {/* Header */}
      <h2 className="font-semibold mb-1">Bookings Status</h2>

      <p className="text-xs text-[var(--earth-light)] mb-3">
        This month · {total} total
      </p>

      {/* Chart */}
      <ResponsiveContainer
        width="100%"
        height="80%"
        minHeight={300}
      >
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            innerRadius="70%"
            outerRadius="90%"
            onMouseEnter={
              hasData
                ? (_, index) => setActiveIndex(index)
                : undefined
            }
            onMouseLeave={
              hasData
                ? () => setActiveIndex(null)
                : undefined
            }
            activeShape={
              hasData
                ? (props) => (
                    <Sector
                      {...props}
                      outerRadius={
                        (props.outerRadius ?? 0) + 6
                      }
                    />
                  )
                : undefined
            }
          >
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  hasData
                    ? COLORS[
                        entry.name as keyof typeof COLORS
                      ] || "#ccc"
                    : "#E5E7EB"
                }
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center Content */}
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