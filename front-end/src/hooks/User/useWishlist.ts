import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";
import { useAuthStore } from "../../stores/authStore";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export type WishlistEntrepreneur = {
  _id: string;
  name: string;
  city: string;
  bio: string;
  skills: string[];
  category: string;
  rating: number;
  totalReviews: number;
  minPrice: number;
  priceUnit: string;
  isAvailableToday: boolean;
  verificationStatus: "Pending" | "Approved" | "Rejected";
};

type WishlistResponse = {
  success: boolean;
  message: string;
  data: WishlistEntrepreneur[];
};

export const useWishlist = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery<WishlistEntrepreneur[]>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const { data } = await axiosApi.get<WishlistResponse>("/users/wishlist");
      return data.data;
    },
    enabled: !!user,
  });
};

type ResponseType = {
  success: boolean;
  message: string;
};

export const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    {
      entrepreneurId: string | undefined;
      isWishlisted: boolean | undefined;
    }
  >({
    mutationFn: async ({ entrepreneurId, isWishlisted }) => {
      if (isWishlisted) {
        const { data } = await axiosApi.delete<ResponseType>(
          `/users/wishlist/${entrepreneurId}`,
        );
        return data;
      } else {
        const { data } = await axiosApi.post<ResponseType>("/users/wishlist", {
          entrepreneurId,
        });
        return data;
      }
    },

    onSuccess: (data, variables) => {
      if (!data.success) {
        toast.error(
          data.message ??
            (variables.isWishlisted
              ? "Failed to remove from wishlist"
              : "Failed to add to wishlist"),
        );
        return;
      }

      toast.success(
        data.message ??
          (variables.isWishlisted
            ? "Removed from wishlist"
            : "Added to wishlist"),
      );

      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({
        queryKey: ["wishlist-check", variables.entrepreneurId],
      });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, try again");
        return;
      }

      toast.error(error.response.data?.message ?? "Something went wrong");
    },
  });
};

type WishlistCheckResponse = {
  success: boolean;
  message: string;
  data: {
    isWishlisted: boolean;
  };
};

export const useIsWishlisted = (entrepreneurId: string | undefined) => {
  const user = useAuthStore((state) => state.user);

  return useQuery<boolean>({
    queryKey: ["wishlist-check", entrepreneurId],
    queryFn: async () => {
      const { data } = await axiosApi.get<WishlistCheckResponse>(
        `/users/wishlist/${entrepreneurId}/check`,
      );
      return data.data.isWishlisted;
    },
    enabled: !!entrepreneurId && !!user && user.role === "User",
  });
};
