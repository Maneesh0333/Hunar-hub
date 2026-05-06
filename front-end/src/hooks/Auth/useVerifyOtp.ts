import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axiosApi from "../../lib/axios";
import toast from "react-hot-toast";
import type { VerifyFormType } from "../../types/auth/types";

type ResponseType = {
  success: true;
  message: string;
}

export function useVerifyOtp() {
  return useMutation<ResponseType, AxiosError<ResponseType>, VerifyFormType & {email: string}>({
    mutationFn: async (formData) => {
      const res = await axiosApi.post("/auth/verify", formData);
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Verification failed");
        return;
      }

      toast.success(data.message ?? "Verification success");
    },

    onError: (error) => {
      if (!error?.response) {
        toast.error("Network error, please try again later.");
        return;
      }

      toast.error(error.response.data.message || "Verification failed");
    },
  });
}
