import type { QuickAction } from "../Admin/AdminOverview";
import BookingsChart from "../charts/BookingsChart";
import BookingStatusPie from "../charts/BookingStatusPie";
import QuickActions from "../QuickActions";
import Button from "../Shared/Button";
import StatsGrid from "../StatsGrid";
import Header from "../Shared/Header";

export type statsDataType = {
  icon: string;
  label: string;
  value: string;
  change: string;
  sub: string;
};

const statsData: statsDataType[] = [
  {
    icon: "💰",
    label: "Total Earnings",
    value: "₹24,200",
    change: "↑ 18% vs last month",
    sub: "₹8,400 this week",
  },
  {
    icon: "📦",
    label: "Total Orders",
    value: "138",
    change: "↑ 12 this month",
    sub: "5 pending today",
  },
  {
    icon: "⭐",
    label: "Avg Rating",
    value: "4.9",
    change: "↑ 138 reviews total",
    sub: "Top 5% in Lucknow",
  },
  {
    icon: "👁️",
    label: "Profile Views",
    value: "2,840",
    change: "↑ 34% this week",
    sub: "28 bookings from views",
  },
];

export const entrepreneurActions: QuickAction[] = [
  {
    icon: "➕",
    title: "Add Service",
    description: "List a new service",
    path: "/entrepreneur/services",
  },
  {
    icon: "📦",
    title: "View Requests",
    description: "5 awaiting response",
    path: "/entrepreneur/orders",
  },
  {
    icon: "📅",
    title: "Update Calendar",
    description: "Set your schedule",
    path: "/entrepreneur/availability",
  },
  {
    icon: "👤",
    title: "My Profile",
    description: "View & edit your details",
    path: "/entrepreneur/profile",
  },
];

export default function OverviewPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAF5ED] text-[#2C1A0E]">
      {/* GREETING */}
      <Header
        title="Good morning,"
        description="Here's how your business is performing today"
        name="Rashida"
        children={<Button label="+ Add New Service" />}
      />

      {/* ALERT */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-xl border border-[rgba(196,99,42,0.12)] bg-gradient-to-br from-[#C4632A]/10 to-[#C4632A]/5">
        <span className="text-xl">🔔</span>
        <div className="flex-1">
          <div className="text-sm font-semibold">
            You have 5 new booking requests waiting for your response
          </div>
          <div className="text-xs text-[#6B4A2D]">
            Respond quickly to maintain your response rate and ranking
          </div>
        </div>
        <button className="px-4 py-2 text-xs font-semibold bg-[#C4632A] text-white rounded-lg">
          View Requests →
        </button>
      </div>

      {/* STATS */}
      <StatsGrid statsData={statsData} />

      {/* CHART + Pie */}
      <div className="flex flex-wrap gap-5 h-100">
        <BookingsChart />
        <BookingStatusPie />
      </div>

      <QuickActions actions={entrepreneurActions} />
    </div>
  );
}
