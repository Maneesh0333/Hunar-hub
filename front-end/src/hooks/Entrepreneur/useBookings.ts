import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export type Booking = {
  _id: string;
  bookingId: string;
  totalAmount: number;
  visitType: "visit_home" | "visit_workshop";
  status: "Pending" | "Confirmed" | "Declined" | "Completed" | "Cancelled";
  paymentStatus: "Pending" | "Paid" | "Failed";
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
  Confirmed: number;
  Declined: number;
  Completed: number;
  Cancelled: number;
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
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: BookingData;
};

export type ResponseType = {
  success: boolean;
  message: string;
};

export const useBookings = (
  search = "",
  status = "All",
  page = 1,
  limit = 5,
) => {
  return useQuery({
    queryKey: ["bookings", search, status, page, limit],

    queryFn: async () => {
      const { data } = await axiosApi.get<ApiResponse>(
        "/bookings/entrepreneur",
        {
          params: { search, status, page, limit },
        },
      );

      return data.data;
    },

    placeholderData: (prev) => prev,
  });
};


export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    { id: string; status: "Confirmed" | "Declined" | "Completed" }
  >({
    mutationFn: async ({ id, status }) => {
      const { data } = await axiosApi.patch<ResponseType>(
        `/bookings/${id}/status`,
        { status },
      );
      return data;
    },

    onSuccess: (data, variables) => {
      if (!data.success) {
        toast.error(data.message ?? "Action failed");
        return;
      }

      // 🎯 Dynamic success message
      const messageMap = {
        Confirmed: "Booking accepted",
        Declined: "Booking declined",
        Completed: "Booking completed",
      };

      toast.success(data.message ?? messageMap[variables.status]);

      // 🔄 Refetch bookings
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },

    onError: (error, variables) => {
      if (!error.response) {
        toast.error("Network error, please try again");
        return;
      }

      const fallback = {
        Confirmed: "Failed to accept booking",
        Declined: "Failed to decline booking",
        Completed: "Failed to complete booking",
      };

      toast.error(
        error.response?.data?.message ?? fallback[variables.status],
      );
    },
  });
};