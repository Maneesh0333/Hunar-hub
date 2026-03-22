import type { statsDataType } from "../Entrepreneur/EntrepreneursOverview";
import QuickActions from "../QuickActions";
import StatsGrid from "../StatsGrid";

const statsData: statsDataType[] = [
  {
    icon: "👥",
    label: "Total Users",
    value: "2,842",
    change: "↑ 124 this month",
    sub: "86 new today",
  },
  {
    icon: "🧵",
    label: "Entrepreneurs",
    value: "412",
    change: "↑ 18 pending approvals",
    sub: "92 verified",
  },
  {
    icon: "📦",
    label: "Total Orders",
    value: "1,284",
    change: "↑ 8% vs last month",
    sub: "23 active disputes",
  },
  {
    icon: "💰",
    label: "Platform Revenue",
    value: "₹3,84,200",
    change: "↑ 22% growth",
    sub: "₹42,000 this week",
  },
];

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
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAF5ED] text-[#2C1A0E]">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">Admin Dashboard 👑</div>
          <div className="text-sm text-[#6B4A2D]">
            Monitor platform activity and system health
          </div>
        </div>
        <button className="px-4 py-2 rounded-lg bg-[#C4632A] text-white text-sm font-semibold">
          Generate Report
        </button>
      </div>
      {/* ALERTS */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-200 bg-red-50">
        <span className="text-xl">🚨</span>
        <div className="flex-1">
          <div className="text-sm font-semibold">
            23 unresolved complaints require attention
          </div>
          <div className="text-xs text-red-600">
            Review flagged orders and user disputes
          </div>
        </div>
        <button className="px-4 py-2 text-xs font-semibold bg-red-500 text-white rounded-lg">
          View Complaints →
        </button>
      </div>
      {/* STATS */}
      <StatsGrid statsData={statsData} />
      {/* PLATFORM ACTIVITY */}
      <div className="bg-white p-4 rounded-xl border border-[rgba(196,99,42,0.12)]">
        <div className="font-semibold mb-2">Platform Growth</div>
        <div className="text-xs text-[#6B4A2D] mb-3">
          User acquisition over last 6 months
        </div>

        <svg viewBox="0 0 520 160" className="w-full">
          <defs>
            <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C4632A" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#C4632A" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d="M30,130 C80,110 120,95 160,100 C200,105 240,75 290,70 C340,65 370,80 410,60 C450,50 480,35 510,30 L510,150 L30,150 Z"
            fill="url(#adminGrad)"
          />

          <path
            d="M30,130 C80,110 120,95 160,100 C200,105 240,75 290,70 C340,65 370,80 410,60 C450,50 480,35 510,30"
            fill="none"
            stroke="#C4632A"
            strokeWidth="2.5"
          />
        </svg>
      </div>
      {/* Quick Actions */}
      <QuickActions actions={adminActions} />;
    </div>
  );
}
