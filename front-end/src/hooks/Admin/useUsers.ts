import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export type UsersStats = {
  Active: number;
  Blocked: number;
};

export type User = {
  _id: string;
  isVerified: boolean;
  status: "Active" | "Blocked";

  createdAt: string;
  name: string;
  email: string;
  phone: string;
};

type UsersResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  results: number;
  totalUsers: number;
  stats: UsersStats;
  users: User[];
};

type ApiResponseType = {
  success: boolean;
  message: string;
  data: UsersResponse;
};

export const useUsers = (
  search: string = "",
  status: string = "All",
  page: number = 1,
  limit: number = 5,
) => {
  return useQuery<UsersResponse, AxiosError<ResponseType>>({
    queryKey: ["users", status, search, page, limit],

    queryFn: async () => {
      const res = await axiosApi.get<ApiResponseType>("/admin/users", {
        params: { status, search, page, limit },
      });

      return res.data.data;
    },

    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

type BlockUnblockResponseType = {
  success: boolean;
  message: string;
};

export const useBlockUsers = () => {
  const queryClient = useQueryClient();

  return useMutation<BlockUnblockResponseType, AxiosError<BlockUnblockResponseType>, string>({
    mutationFn: async (id: string) => {
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

      toast.success(data.message || "User blocked successfully");

      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }

      toast.error(error.response.data?.message || "Block failed");
    },
  });
};

export const useUnblockUsers = () => {
  const queryClient = useQueryClient();

  return useMutation<BlockUnblockResponseType, AxiosError<BlockUnblockResponseType>, string>({
    mutationFn: async (id: string) => {
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

      toast.success(data.message || "User unblocked successfully");

      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }

      toast.error(error.response.data?.message || "Unblock failed");
    },
  });
};
