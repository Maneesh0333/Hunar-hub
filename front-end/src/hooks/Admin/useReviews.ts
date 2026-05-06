import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export type Review = {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;

  customer: {
    name: string;
    email: string;
  };

  entrepreneur: {
    user: {
      name: string;
    };
  };

  service: {
    title: string;
  };
};

type ReviewsResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  results: number;
  totalReviews: number;
  stats: Record<number, number>;
  reviews: Review[];
};

type ResponeType = {
  success: boolean;
  message: string;
};

type ApiResponseType = ResponeType & {
  data: ReviewsResponse;
};

/* ================= GET REVIEWS ================= */
export const useReviews = (
  search: string = "",
  rating: string = "All",
  page: number = 1,
  limit: number = 5,
) => {
  return useQuery<ReviewsResponse, AxiosError<ResponeType>>({
    queryKey: ["reviews", rating, search, page, limit],

    queryFn: async () => {
      const res = await axiosApi.get<ApiResponseType>("/admin/reviews", {
        params: { search, rating, page, limit },
      });

      return res.data.data;
    },

    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

/* ================= DELETE REVIEW ================= */
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponeType, AxiosError<ResponeType>, string>(
    {
      mutationFn: async (id: string) => {
        const res = await axiosApi.delete(`/admin/reviews/${id}`);
        return res.data;
      },

      onSuccess: (data) => {
        if (!data.success) {
          toast.error(data.message || "Delete failed");
          return;
        }

        toast.success(data.message || "Review deleted successfully");

        queryClient.invalidateQueries({ queryKey: ["reviews"] });
      },

      onError: (error) => {
        if (!error.response) {
          toast.error("Network error, please try again later.");
          return;
        }

        toast.error(error.response.data?.message || "Delete failed");
      },
    },
  );
};
