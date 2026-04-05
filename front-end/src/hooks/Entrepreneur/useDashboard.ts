import { useQuery } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";

/* ---------------- TYPES ---------------- */

export type DashboardStats = {
  totalEarnings: number;
  totalOrders: number;
  avgRating: number;
  totalReviews: number;
  pendingToday: number;
};

export type MonthlyBooking = {
  month: string; // "Jan", "Feb"
  bookings: number;
};

/* ✅ Updated: now array format */
export type StatusStat = {
  name: string;   // "Pending"
  value: number;
};

export type DashboardData = {
  stats: DashboardStats;
  charts: {
    monthlyBookings: MonthlyBooking[];
    statusStats: StatusStat[]; // ✅ changed
  };
};

/* ---------------- API RESPONSE ---------------- */

export type DashboardResponse = {
  success: boolean;
  message?: string; // optional (safer)
  data: DashboardData;
};

/* ---------------- HOOK ---------------- */

export const useEntrepreneurDashboard = () => {
  return useQuery({
    queryKey: ["entrepreneur-dashboard"],

    queryFn: async (): Promise<DashboardData> => {
      const { data } = await axiosApi.get<DashboardResponse>(
        "/entrepreneurs/dashboard"
      );

      return data.data;
    },
  });
};