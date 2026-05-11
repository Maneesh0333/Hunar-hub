import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { type GrowthData } from "../../hooks/Admin/useAdminDashboard";

/* ---------------- MONTH MAP ---------------- */
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function AdminGrowthChart({
  growth,
}: {
  growth: GrowthData[] | undefined;
}) {
  const chartData = MONTHS.map((month, index) => {
    const found = growth?.find((g) => g._id === index + 1);

    return {
      name: month,
      users: found?.users || 0,
    };
  });

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-white rounded-2xl border border-[rgba(196,99,42,0.12)] p-6">
      <h2 className="font-semibold mb-1">User Growth</h2>
      <p className="text-xs text-[#6B4A2D] mb-6">Monthly user registrations</p>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />
            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="users"
              stroke="#C4632A"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
