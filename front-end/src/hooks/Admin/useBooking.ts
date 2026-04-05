import { useQuery } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";

export type AdminBooking = {
  _id: string;
  bookingId: string;
  totalAmount: number;
  visitType: "visit_home" | "visit_workshop";
  status: "Pending" | "Confirmed" | "Declined" | "Completed" | "Cancelled";
  paymentStatus: "Pending" | "Paid" | "Failed";
  createdAt: string;

  service: {
    title: string;
  };

  customer: {
    name: string;
    phone: string;
  };

  entrepreneur: {
    user: {
      name: string;
    };
  };
};

export type AdminBookingStats = {
  Pending: number;
  Confirmed: number;
  Declined: number;
  Completed: number;
  Cancelled: number;
};

export type AdminBookingResponse = {
  bookings: AdminBooking[];
  stats: AdminBookingStats;
  total: number;
  page: number;
  totalPages: number;
};

type ApiResponse = {
  success: boolean;
  data: AdminBookingResponse;
};

export const useAdminBookings = (
  search = "",
  status = "All",
  page = 1,
  limit = 10,
) => {
  return useQuery({
    queryKey: ["admin-bookings", search, status, page, limit],

    queryFn: async () => {
      const { data } = await axiosApi.get<ApiResponse>("/admin/bookings", {
        params: { search, status, page, limit },
      });

      return data.data;
    },

    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
  });
};
