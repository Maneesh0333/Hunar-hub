import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

/* ---------------- TYPES ---------------- */

type MonthlyBooking = {
  month: string;
  bookings: number;
};

type Props = {
  data: MonthlyBooking[];
  total: number;
};

export default function BookingsChart({ data, total }: Props) {
  return (
    <div className="flex-2 h-96 bg-white rounded-2xl shadow p-6">
      <h2 className="font-semibold mb-1">Bookings Overview</h2>
      <p className="text-xs mb-6">This year · {total}</p>

      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line dataKey="bookings" stroke="#C4632A" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}