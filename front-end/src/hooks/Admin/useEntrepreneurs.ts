import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";
import type { BlockUnblockResponseType } from "./useUsers";

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

export const useEntrepreneurs = (
  status: string,
  search: string,
  view: "entrepreneurs" | "applications",
) => {
  return useQuery<EntrepreneursResponse>({
    queryKey: ["entrepreneurs", status, search],
    queryFn: async () => {
      const res = await axiosApi.get(
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

    initialData: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
      results: 0,
      totalEntrepreneurs: 0,
      stats: { Pending: 0, Approved: 0, Rejected: 0 },
      entrepreneurs: [],
    },
  });
};

type ApproveRejectResponseType = {
  success: boolean;
  message: string;
};

export const useApproveEntrepreneur = () => {
  const queryClient = useQueryClient();

  return useMutation<ApproveRejectResponseType, Error, string>({
    mutationFn: (id: string) =>
      axiosApi.patch(`/admin/entrepreneurs/${id}/approve`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entrepreneurs"] });
    },
  });
};

export const useRejectEntrepreneur = () => {
  const queryClient = useQueryClient();

  return useMutation<ApproveRejectResponseType, Error, string>({
    mutationFn: (id: string) =>
      axiosApi.patch(`/admin/entrepreneurs/${id}/reject`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entrepreneurs"] });
    },
  });
};

export const useBlockEntrepreneur = () => {
  const queryClient = useQueryClient();

  return useMutation<BlockUnblockResponseType, Error, string>({
    mutationFn: (id: string) => axiosApi.patch(`/admin/users/${id}/block`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entrepreneurs"] });
    },
  });
};

export const useUnblockEntrepreneur = () => {
  const queryClient = useQueryClient();

  return useMutation<BlockUnblockResponseType, Error, string>({
    mutationFn: (id: string) => axiosApi.patch(`/admin/users/${id}/unblock`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entrepreneurs"] });
    },
  });
};
