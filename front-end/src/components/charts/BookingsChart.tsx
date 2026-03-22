import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", bookings: 12 },
  { name: "Tue", bookings: 18 },
  { name: "Wed", bookings: 9 },
  { name: "Thu", bookings: 22 },
  { name: "Fri", bookings: 30 },
];

export default function BookingsChart() {
  return (
    <div className="flex-2 h-full bg-white rounded-2xl shadow p-6">
      <h2 className="font-semibold mb-1">Order Status</h2>
      <p className="text-xs text-[var(--earth-light)] mb-8">
        This month · 138 total
      </p>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="bookings"
            stroke="#C4632A"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
