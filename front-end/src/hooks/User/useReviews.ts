import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useInfiniteQuery } from "@tanstack/react-query";

type CreateReviewPayload = {
  bookingId: string;
  rating: number;
  comment?: string;
};

type ResponseType = {
  success: boolean;
  message: string;
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    CreateReviewPayload
  >({
    mutationFn: async (payload) => {
      const { data } = await axiosApi.post<ResponseType>(
        "entrepreneurs/review",
        payload,
      );
      return data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || "Failed to submit review");
        return;
      }

      toast.success(data.message || "Review submitted successfully ⭐");

      // 🔄 Refresh related queries
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["review-stats"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] }); // optional if UI depends
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again");
        return;
      }

      toast.error(error.response.data?.message || "Failed to submit review");
    },
  });
};



export type Review = {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;

  customer: {
    _id: string;
    name: string;
  };

  service: {
    _id: string;
    title: string;
  };
};

export type ReviewsResponse = {
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;

  // ✅ from updated backend
  average: number;
  breakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: ReviewsResponse;
};

/* ---------------- HOOK ---------------- */

export const useInfiniteReviews = (
  entrepreneurId?: string,
  limit = 3
) => {
  return useInfiniteQuery<ReviewsResponse, Error>({
    queryKey: ["reviews", entrepreneurId],

    // ✅ required in v5
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const { data } = await axiosApi.get<ApiResponse>(
        `entrepreneurs/reviews/${entrepreneurId}`,
        {
          params: { page: pageParam, limit },
        }
      );

      return data.data;
    },
    placeholderData: (prev) => prev,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.totalPages
        ? lastPage.page + 1
        : undefined;
    },

    enabled: !!entrepreneurId,
  });
};