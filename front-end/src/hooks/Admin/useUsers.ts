import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";

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

export const useUsers = (status: string, search: string) => {
  return useQuery<UsersResponse>({
    queryKey: ["users", status, search],
    queryFn: async () => {
      const res = await axiosApi.get(
        `/admin/users?status=${status}&search=${search}`,
      );

      const data = res.data?.data;

      return {
        page: data?.page ?? 1,
        limit: data?.limit ?? 10,
        total: data?.total ?? 0,
        totalUsers: data?.totalUsers ?? 0,
        totalPages: data?.totalPages ?? 1,
        results: data?.results ?? 0,
        stats: data?.stats ?? { Active: 0, Blocked: 0 },
        users: data?.users ?? [],
      };
    },

    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
  });
};

export type BlockUnblockResponseType = {
  success: boolean;
  message: string;
};

export const useBlockUsers = () => {
  const queryClient = useQueryClient();

  return useMutation<BlockUnblockResponseType, Error, string>({
    mutationFn: (id: string) => axiosApi.patch(`/admin/users/${id}/block`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUnblockUsers = () => {
  const queryClient = useQueryClient();

  return useMutation<BlockUnblockResponseType, Error, string>({
    mutationFn: (id: string) => axiosApi.patch(`/admin/users/${id}/unblock`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
