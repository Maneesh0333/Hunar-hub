import { useQuery } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";

export type Booking = {
  _id: string;
  bookingId: string;
  totalAmount: number;
  paymentStatus: "Pending" | "Paid";
  createdAt: string;

  customer: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };

  service: {
    _id: string;
    title: string;
    price: number;
  };
};

export type BookingStats = {
  Pending: number;
  Paid: number;
};

export type BookingData = {
  bookings: Booking[];
  stats: BookingStats;
  page: number;
  limit: number;
  total: number;
  totalBookings: number;
  totalPages: number;
  results: number;
  totalEarning: number;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: BookingData;
};

export const useEarning = (
  search: string = "",
  page: number = 1,
  limit: number = 5,
) => {
  return useQuery({
    queryKey: ["bookings", search, page, limit],

    queryFn: async () => {
      const { data } = await axiosApi.get<ApiResponse>("/bookings/earning", {
        params: { search, page, limit },
      });

      return data.data;
    },

    placeholderData: (prev) => prev,
  });
};
