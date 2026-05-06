import { useAdminDashboard } from "../../hooks/Admin/useAdminDashboard";
import { useNetworkStatus } from "../../hooks/Shared/useNetworkStatus";
import ErrorState from "../../pages/ErrorState";
import NoInternet from "../../pages/NoInternet";
import type { QuickAction } from "../../types/shared/types";
import AdminGrowthChart from "../charts/AdminGrowthChart";
import QuickActions from "../QuickActions";
import Header from "../Shared/Header";
import Spinner from "../Shared/Spinner";
import StatsGrid from "../StatsGrid";

const adminActions: QuickAction[] = [
  {
    icon: "✅",
    title: "Approve Entrepreneurs",
    description: "Review and approve entrepreneurs",
    path: "/admin/approvals",
  },
  {
    icon: "🚨",
    title: "Complaints",
    description: "View and resolve complaints",
    path: "/admin/complaints",
  },
  {
    icon: "📊",
    title: "Bookings",
    description: "View all bookings",
    path: "/admin/bookings",
  },
  {
    icon: "🏷️",
    title: "Categories",
    description: "Manage categories",
    path: "/admin/categories",
  },
];

export default function AdminOverview() {
  const { data, isLoading, isError, refetch, isFetching } = useAdminDashboard();
  const isOnline = useNetworkStatus();

  const statsData = [
    {
      icon: "👥",
      label: "Total Users",
      value: data?.stats?.totalUsers.toString() || "0",
      change: `+${data?.stats?.newUsersToday || "0"} today`,
      sub: "",
    },
    {
      icon: "🧵",
      label: "Entrepreneurs",
      value: data?.stats.totalEntrepreneurs.toString() || "0",
      change: `${data?.stats.pendingApprovals || "0"} pending`,
      sub: `${data?.stats.verifiedEntrepreneurs || "0"} verified`,
    },
    {
      icon: "📦",
      label: "Orders",
      value: data?.stats.totalOrders.toString() || "0",
      change: "",
      sub: `${data?.stats.completedOrders || "0"} completed`,
    },
    {
      icon: "💰",
      label: "Revenue",
      value: `₹${data?.stats.totalRevenue || "0"}`,
      change: "",
      sub: `₹${data?.stats.weeklyRevenue || "0"} this week`,
    },
  ];

  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load stats"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }
  return (
    <div className="flex-1 flex flex-col space-y-6 bg-[#FAF5ED] text-[#2C1A0E]">
      {/* HEADER */}
      <Header
        title="Admin Dashboard"
        description="Monitor platform activity and system health"
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <StatsGrid statsData={statsData} />
          {/* PLATFORM ACTIVITY */}
          <AdminGrowthChart growth={data?.charts?.growth} />
          {/* Quick Actions */}
          <QuickActions actions={adminActions} />
        </div>
      )}
    </div>
  );
}
