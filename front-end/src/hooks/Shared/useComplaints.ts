import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axiosApi from "../../lib/axios";
import toast from "react-hot-toast";
import type { ComplaintFormType } from "../../types/user/types";

export type ComplaintPayload = ComplaintFormType & {
  booking: string;
};

export type ResponseType = {
  success: boolean;
  message: string;
};

export const useCreateComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, ComplaintPayload>({
    mutationFn: async (formData) => {
      const { data } = await axiosApi.post<ResponseType>(
        "/complaints",
        formData,
      );
      return data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Complaint submission failed");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      toast.success(data.message ?? "Complaint submitted successfully");
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again");
        return;
      }

      toast.error(error.response.data?.message ?? "Failed to submit complaint");
    },
  });
};

export type Complaint = {
  _id: string;
  complaintId: string;
  type: string;
  description: string;
  status: "Open" | "In Review" | "Resolved";
  createdAt: string;

  customerName: string;
  customerPhone: string;

  entrepreneurName: string;
  entrepreneurId: string;

  bookingId: string;
  bookingStatus: string;
};

export type ComplaintStats = {
  Open: number;
  "In Review": number;
  Resolved: number;
};

export type ComplaintData = {
  complaints: Complaint[];
  stats: ComplaintStats;
  page: number;
  limit: number;
  total: number;
  totalComplaints: number;
  totalPages: number;
  results: number;
};

type ComplaintApiResponse = {
  success: boolean;
  message: string;
  data: ComplaintData;
};

export const useComplaints = (
  search: string = "",
  status: string = "All",
  page: number = 1,
  limit: number = 5,
) => {
  return useQuery({
    queryKey: ["complaints", search, status, page, limit],

    queryFn: async () => {
      const { data } = await axiosApi.get<ComplaintApiResponse>("/complaints", {
        params: { search, status, page, limit },
      });

      return data.data;
    },

    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

export const useUpdateComplaintStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    { id: string; status: "Open" | "In Review" | "Resolved" }
  >({
    mutationFn: async ({ id, status }) => {
      const { data } = await axiosApi.patch<ResponseType>(
        `/complaints/${id}/status`,
        { status },
      );
      return data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Update failed");
        return;
      }

      toast.success(data.message ?? "Status updated");

      queryClient.invalidateQueries({ queryKey: ["complaints"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, try again later");
        return;
      }

      toast.error(error.response.data?.message ?? "Update failed");
    },
  });
};
