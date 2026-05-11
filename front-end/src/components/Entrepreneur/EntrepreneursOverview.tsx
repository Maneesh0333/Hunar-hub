import QuickActions from "../QuickActions";
import StatsGrid from "../StatsGrid";
import Header from "../Shared/Header";
import { useEntrepreneurDashboard } from "../../hooks/Entrepreneur/useDashboard";
import Spinner from "../Shared/Spinner";
import { useAuthStore } from "../../stores/authStore";
import ErrorState from "../../pages/ErrorState";
import NoInternet from "../../pages/NoInternet";
import { useNetworkStatus } from "../../hooks/Shared/useNetworkStatus";
import type { QuickAction } from "../../types/shared/types";
import { lazy, Suspense } from "react";

const BookingsChart = lazy(() => import("../charts/BookingsChart"));
const BookingStatusPie = lazy(() => import("../charts/BookingStatusPie"));

const entrepreneurActions: QuickAction[] = [
  {
    icon: "➕",
    title: "Add Service",
    description: "List a new service",
    path: "/entrepreneur/services",
  },
  {
    icon: "📦",
    title: "View Requests",
    description: "View the booking requests",
    path: "/entrepreneur/booking",
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
  const { data, isLoading, isError, refetch, isFetching } =
    useEntrepreneurDashboard();
  const user = useAuthStore((state) => state.user);
  const isOnline = useNetworkStatus();

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
      {/* GREETING */}

      <Header
        title="Good morning,"
        description="Here's how your business is performing today"
        name={user?.name}
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <StatsGrid
            statsData={statsData}
            className="max-md:grid-cols-1! grid-cols-3!"
          />

          {/* CHART + Pie */}
          <div className="flex gap-5 max-[1300px]:flex-col">
            <Suspense
              fallback={
                <div className="flex-1 h-[450px] bg-white rounded-2xl flex items-center justify-center">
                  <Spinner />
                </div>
              }
            >
              <BookingsChart
                data={data?.charts?.monthlyBookings || []}
                total={data?.stats?.totalOrders || 0}
              />
            </Suspense>

            <Suspense
              fallback={
                <div className="w-[350px] h-[450px] bg-white rounded-2xl flex items-center justify-center">
                  <Spinner />
                </div>
              }
            >
              <BookingStatusPie
                data={data?.charts?.statusStats || []}
                total={data?.stats?.totalOrders || 0}
              />
            </Suspense>
          </div>

          <QuickActions actions={entrepreneurActions} />
        </>
      )}
    </div>
  );
}
