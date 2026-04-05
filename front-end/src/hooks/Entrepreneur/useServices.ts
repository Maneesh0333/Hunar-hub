import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import type { UpdateServiceSchemaType } from "../../components/forms/ServiceForm";

export type Service = {
  _id: string;
  title: string;
  description: string;
  price: number;
  priceUnit: "per_piece" | "per_hour" | "per_service";
  deliveryTime?: string;
  isActive: boolean;
  createdAt: string;
};

export type ServicesStats = {
  Active: number;
  Inactive: number;
};

export type ServicesData = {
  services: Service[];
  stats: ServicesStats;
  page: number;
  limit: number;
  total: number;
  totalServices: number;
  totalPages: number;
  results: number;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: ServicesData;
};

export type ResponseType = {
  success: boolean;
  message: string;
};

export const useServices = (
  search = "",
  status = "All",
  page = 1,
  limit = 5,
) => {
  return useQuery({
    queryKey: ["services", search, status, page, limit],

    queryFn: async () => {
      const { data } = await axiosApi.get<ApiResponse>("/services/my", {
        params: { search, status, page, limit },
      });

      return data.data;
    },
    placeholderData: (prev) => prev,
  });
};

export const useCreateServices = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, any>({
    mutationFn: async (formData) => {
      const res = await axiosApi.post<ResponseType>("/services", formData);
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to create service");
        return;
      }

      toast.success(data.message ?? "Service created");
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again");
      }
      toast.error(error.response?.data?.message ?? "Failed to create service");
    },
  });
};

export const useUpdateServices = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    { serviceId: string; dataMod: Partial<UpdateServiceSchemaType> }
  >({
    mutationFn: async ({ serviceId, dataMod }) => {
      const res = await axiosApi.patch<ResponseType>(
        `/services/${serviceId}`,
        dataMod,
      );
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Update failed");
        return;
      }

      toast.success(data.message ?? "Service updated");
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again");
      }
      toast.error(error.response?.data?.message ?? "Update failed");
    },
  });
};

export const useToggleService = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    { id: string; action: "enable" | "disable" }
  >({
    mutationFn: async ({ id, action }) => {
      const { data } = await axiosApi.patch<ResponseType>(
        `/services/${id}/${action}`,
      );
      return data;
    },

    onSuccess: (data, variables) => {
      if (!data.success) {
        toast.error(data.message ?? "Action failed");
        return;
      }

      toast.success(
        data.message ??
          `Service ${variables.action === "enable" ? "enabled" : "disabled"}`,
      );

      queryClient.invalidateQueries({ queryKey: ["services"] });
    },

    onError: (error, variables) => {
      if (!error.response) {
        toast.error("Network error, please try again");
      }
      toast.error(
        error.response?.data?.message ??
          `Service ${variables.action === "enable" ? "enabled" : "disabled"}`,
      );
    },
  });
};
