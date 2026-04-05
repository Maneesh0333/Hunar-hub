import { useQuery } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";

/* ---------------- TYPES ---------------- */

export type AdminStats = {
  totalUsers: number;
  newUsersToday: number;

  totalEntrepreneurs: number;
  pendingApprovals: number;
  verifiedEntrepreneurs: number;

  totalOrders: number;
  completedOrders: number;

  totalRevenue: number;
  weeklyRevenue: number;
};

export type GrowthData = {
  _id: number; // month (1–12)
  users: number;
};

export type AdminDashboardData = {
  stats: AdminStats;
  charts: {
    growth: GrowthData[];
  };
};

type ApiResponse = {
  success: boolean;
  data: AdminDashboardData;
};

export const useAdminDashboard = () => {
  return useQuery<AdminDashboardData>({
    queryKey: ["admin-dashboard"],

    queryFn: async () => {
      const { data } = await axiosApi.get<ApiResponse>("/admin/dashboard");
      return data.data;
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
  });
};
