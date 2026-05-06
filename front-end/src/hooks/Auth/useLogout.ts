import toast from "react-hot-toast";
import axiosApi from "../../lib/axios";
import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/authStore";

type ResponseType = {
  success: boolean;
  message: string;
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, void>({
    mutationFn: async () => {
      const res = await axiosApi.post<ResponseType>("/auth/logout");
      return res.data;
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || "Logout Failed.");
        return;
      }
      logout();
      queryClient.clear();
      toast.success("Logout Success.");
    },
    onError: (err) => {
      if (!err.response) {
        toast.error("Network error, please try again later.");
        return;
      }
      toast.error(err.response.data.message || "Logout Failed.");
    },
  });
};
