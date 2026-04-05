import { useAdminDashboard } from "../../hooks/Admin/useAdminDashboard";
import AdminGrowthChart from "../charts/AdminGrowthChart";
import QuickActions from "../QuickActions";
import Header from "../Shared/Header";
import Spinner from "../Shared/Spinner";
import StatsGrid from "../StatsGrid";

export type QuickAction = {
  icon: string;
  title: string;
  description: string;
  path: string;
};

const adminActions: QuickAction[] = [
  {
    icon: "✅",
    title: "Approve Users",
    description: "18 pending",
    path: "/admin/approvals",
  },
  {
    icon: "🚨",
    title: "Handle Complaints",
    description: "23 open",
    path: "/admin/complaints",
  },
  {
    icon: "📊",
    title: "View Analytics",
    description: "Revenue & growth",
    path: "/admin/analytics",
  },
  {
    icon: "🏷️",
    title: "Handle Categories",
    description: "Add new categories",
    path: "/admin/categories",
  },
];

export default function AdminOverview() {
  const { data, isLoading, isError } = useAdminDashboard();

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

  if (isLoading) return <Spinner />;
  if (isError) return <p>Error loading dashboard</p>;
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAF5ED] text-[#2C1A0E]">
      {/* HEADER */}
      <Header
        title="Admin Dashboard"
        description="Monitor platform activity and system health"
        children={
          <button className="px-4 py-2 rounded-lg bg-[#C4632A] text-white text-sm font-semibold">
            Generate Report
          </button>
        }
      />
      {/* STATS */}
      <StatsGrid statsData={statsData} />
      {/* PLATFORM ACTIVITY */}
      <AdminGrowthChart growth={data?.charts?.growth}/>
      {/* Quick Actions */}
      <QuickActions actions={adminActions} />;
    </div>
  );
}
