import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";
import type { BlockUnblockResponseType } from "./useUsers";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

export type Entrepreneur = {
  _id: string;
  verificationStatus: "Pending" | "Approved" | "Rejected";
  createdAt: string;
  bio: string;
  city: string;
  category: [];
  rating: {
    average: number;
    totalReviews: number;
  };
  completedOrders: number;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
  };
};

export type EntrepreneurStats = {
  Pending: number;
  Approved: number;
  Rejected: number;
};

type EntrepreneursResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  results: number;
  totalEntrepreneurs: number;
  stats: EntrepreneurStats;
  entrepreneurs: Entrepreneur[];
};

type ResponseType = {
  success: boolean;
  message: string;
  data: EntrepreneursResponse;
};

export const useEntrepreneurs = (
  status: string,
  search: string,
  view: "entrepreneurs" | "applications",
) => {
  return useQuery({
    queryKey: ["entrepreneurs", status, search],
    queryFn: async () => {
      const res = await axiosApi.get<ResponseType>(
        `/admin/entrepreneurs?status=${status}&search=${search}&view=${view}`,
      );

      const data = res.data?.data;

      return {
        page: data?.page ?? 1,
        limit: data?.limit ?? 10,
        total: data?.total ?? 0,
        totalEntrepreneurs: data?.totalEntrepreneurs ?? 0,
        totalPages: data?.totalPages ?? 1,
        results: data?.results ?? 0,
        stats: data?.stats ?? { Pending: 0, Approved: 0, Rejected: 0 },
        entrepreneurs: data?.entrepreneurs ?? [],
      };
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
  });
};

type ApproveRejectResponseType = {
  success: boolean;
  message: string;
};

export const useApproveEntrepreneur = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApproveRejectResponseType,
    AxiosError<ApproveRejectResponseType>,
    string
  >({
    mutationFn: async (id) => {
      const res = await axiosApi.patch<ApproveRejectResponseType>(
        `/admin/entrepreneurs/${id}/approve`,
      );
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || "Approval failed");
        return;
      }

      toast.success(data.message || "Approval successful");

      queryClient.invalidateQueries({
        queryKey: ["entrepreneurs"],
      });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }

      toast.error(error.response.data?.message || "Approval failed");
    },
  });
};

export const useRejectEntrepreneur = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApproveRejectResponseType,
    AxiosError<ApproveRejectResponseType>,
    string
  >({
    mutationFn: async (id) => {
      const res = await axiosApi.patch<ApproveRejectResponseType>(
        `/admin/entrepreneurs/${id}/reject`,
      );
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || "Rejection failed");
        return;
      }

      toast.success(data.message || "Entrepreneur rejected");

      queryClient.invalidateQueries({
        queryKey: ["entrepreneurs"],
      });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }

      toast.error(error.response?.data?.message || "Rejection failed");
    },
  });
};

export const useBlockEntrepreneur = () => {
  const queryClient = useQueryClient();

  return useMutation<
    BlockUnblockResponseType,
    AxiosError<BlockUnblockResponseType>,
    string
  >({
    mutationFn: async (id) => {
      const res = await axiosApi.patch<BlockUnblockResponseType>(
        `/admin/users/${id}/block`,
      );
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || "Block failed");
        return;
      }

      toast.success(data.message || "Entrepreneur blocked");

      queryClient.invalidateQueries({
        queryKey: ["entrepreneurs"],
      });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }

      toast.error(error.response?.data?.message || "Block failed");
    },
  });
};

export const useUnblockEntrepreneur = () => {
  const queryClient = useQueryClient();

  return useMutation<
    BlockUnblockResponseType,
    AxiosError<BlockUnblockResponseType>,
    string
  >({
    mutationFn: async (id) => {
      const res = await axiosApi.patch<BlockUnblockResponseType>(
        `/admin/users/${id}/unblock`,
      );
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || "Unblock failed");
        return;
      }

      toast.success(data.message || "Entrepreneur unblocked");

      queryClient.invalidateQueries({
        queryKey: ["entrepreneurs"],
      });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }
      toast.error(error.response?.data?.message || "Unblock failed");
    },
  });
};
