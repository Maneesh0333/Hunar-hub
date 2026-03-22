import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import axiosApi from "../../lib/axios";
import type {
  FormType,
  UpdateScheduleSchemaType,
} from "../../components/forms/ScheduleForm";

export type Schedule = {
  _id: string;
  entrepreneur: string; 
  day: string;
  start?: string;
  end?: string;
  working: boolean;
  createdAt: string;
  updatedAt: string;
};

// API response
export type GetSchedulesResponse = {
  success: boolean;
  message: string;
  data: Schedule[];
};

export type ResponseType = {
  success: boolean;
  message: string;
};

export const useSchedules = () => {
  return useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      const { data } = await axiosApi.get<GetSchedulesResponse>(
        "/entrepreneurs/me/schedule",
      );
      return data.data  ;
    },
  });
};

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    FormType
  >({
    mutationFn: async (formData) => {
      const { data } = await axiosApi.post<ResponseType>(
        "/entrepreneurs/me/schedule",
        formData,
      );
      return data;
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to save schedule");
        return;
      }
      toast.success(data.message ?? "Schedule saved successfully");
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, try again later");
        return;
      }
      toast.error(error.response.data?.message ?? "Failed to save schedule");
    },
  });
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    { scheduleId: string; dataMod: Partial<UpdateScheduleSchemaType> }
  >({
    mutationFn: async ({ scheduleId, dataMod }) => {
      const { data } = await axiosApi.patch<ResponseType>(
        `/entrepreneurs/me/schedule/${scheduleId}`,
        dataMod,
      );
      return data;
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to save schedule");
        return;
      }
      toast.success(data.message ?? "Schedule saved successfully");
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, try again later");
        return;
      }
      toast.error(error.response.data?.message ?? "Failed to save schedule");
    },
  });
};
