import toast from "react-hot-toast";
import axiosApi from "../../lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type Availability = {
  unavailableDates: string[]; // ISO dates
};

export type GetAvailabilityResponse = {
  success: boolean;
  data: Availability;
};

export type SaveAvailabilityPayload = {
  unavailableDates: string[];
};

export const useAvailability = () => {
  return useQuery({
    queryKey: ["availability"],
    queryFn: async () => {
      const { data } = await axiosApi.get<GetAvailabilityResponse>(
        "/entrepreneurs/me/availability"
      );
      return data.data;
    },
  });
};


export type ResponseType = {
  success: boolean;
  message: string;
};

export const useSaveAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    SaveAvailabilityPayload
  >({
    mutationFn: async (payload) => {
      const { data } = await axiosApi.post<ResponseType>(
        "/entrepreneurs/me/availability",
        payload
      );
      return data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to save availability");
        return;
      }

      toast.success(data.message ?? "Availability updated");

      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, try again later");
        return;
      }

      toast.error(
        error.response.data?.message ?? "Failed to save availability"
      );
    },
  });
};