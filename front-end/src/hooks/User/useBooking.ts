import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axiosApi from "../../lib/axios";
import toast from "react-hot-toast";
import type { bookingSchemaType } from "../../types/user/types";

/* ---------------- COMMON TYPES ---------------- */

export type ResponseType = {
  success: boolean;
  message: string;
};

/* ---------------- CREATE BOOKING ---------------- */

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, bookingSchemaType>(
    {
      mutationFn: async (formData) => {
        const { data } = await axiosApi.post<ResponseType>(
          "/bookings",
          formData,
        );
        return data;
      },

      onSuccess: (data) => {
        if (!data.success) {
          toast.error(data.message ?? "Booking failed");
          return;
        }

        toast.success(data.message ?? "Booked successfully");

        // 🔥 refresh user bookings instantly
        queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      },

      onError: (error) => {
        if (!error.response) {
          toast.error("Network error, try again later");
          return;
        }

        toast.error(error.response.data?.message ?? "Booking failed");
      },
    },
  );
};

export type Booking = {
  _id: string;
  bookingId: string;
  totalAmount: number;
  visitType: "visit_home" | "visit_workshop";
  status: "Pending" | "Confirmed" | "Declined" | "Completed" | "Cancelled";
  paymentStatus: "Pending" | "Paid" | "Failed";
  createdAt: string;

  isReviewed: boolean;
  isComplained: boolean;

  reviewRating?: number;

  service: {
    _id: string;
    title: string;
    price: number;
  };

  entrepreneur: {
    _id: string;
    user: {
      _id: string;
      name: string;
      phone: string;
    };
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

/* ---------------- GET USER BOOKINGS ---------------- */

export const useUserBookings = (
  search = "",
  status = "All",
  page = 1,
  limit = 5,
) => {
  return useQuery({
    queryKey: ["user-bookings", search, status, page, limit],

    queryFn: async () => {
      const { data } = await axiosApi.get<ApiResponse>("/bookings/user", {
        params: { search, status, page, limit },
      });

      return data.data;
    },

    placeholderData: (prev) => prev,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

/* ---------------- CANCEL BOOKING ---------------- */

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, { id: string }>({
    mutationFn: async ({ id }) => {
      const { data } = await axiosApi.patch<ResponseType>(
        `/bookings/${id}/cancel`,
      );
      return data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Cancel failed");
        return;
      }

      toast.success(data.message ?? "Booking cancelled");

      // 🔥 refresh everything related
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again");
        return;
      }

      toast.error(error.response?.data?.message ?? "Failed to cancel booking");
    },
  });
};
