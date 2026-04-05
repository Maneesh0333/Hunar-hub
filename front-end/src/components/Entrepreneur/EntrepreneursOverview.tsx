import type { QuickAction } from "../Admin/AdminOverview";
import BookingsChart from "../charts/BookingsChart";
import BookingStatusPie from "../charts/BookingStatusPie";
import QuickActions from "../QuickActions";
import StatsGrid from "../StatsGrid";
import Header from "../Shared/Header";
import { useEntrepreneurDashboard } from "../../hooks/Entrepreneur/useDashboard";
import Spinner from "../Shared/Spinner";

export type statsDataType = {
  icon: string;
  label: string;
  value: string;
  change: string;
  sub: string;
};

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
  const { data, isLoading, isError, error } = useEntrepreneurDashboard();

  const statsData = [
    {
      icon: "💰",
      label: "Total Earnings",
      value: `₹${data?.stats.totalEarnings || 0}`,
      change: "",
      sub: "",
    },
    {
      icon: "📦",
      label: "Total Bookings",
      value: `${data?.stats?.totalOrders || 0}`,
      change: "",
      sub: `${data?.stats?.pendingToday || 0} pending today`,
    },
    {
      icon: "⭐",
      label: "Avg Rating",
      value: `${data?.stats?.avgRating || 0}`,
      change: `${data?.stats?.totalReviews || 0} reviews`,
      sub: "",
    },
  ];

  if (isLoading) return <Spinner />;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAF5ED] text-[#2C1A0E]">
      {/* GREETING */}
      <Header
        title="Good morning,"
        description="Here's how your business is performing today"
        name="Rashida"
      />

      {/* STATS */}
      <StatsGrid statsData={statsData} />

      {/* CHART + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <BookingsChart
          data={data?.charts?.monthlyBookings || []}
          total={data?.stats?.totalOrders || 0}
        />
        <BookingStatusPie
          data={data?.charts?.statusStats || []}
          total={data?.stats?.totalOrders || 0}
        />
      </div>

      <QuickActions actions={entrepreneurActions} />
    </div>
  );
}
