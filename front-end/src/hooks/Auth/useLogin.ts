import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import axiosApi from "../../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../../stores/authStore";
import type { LoginFormType } from "../../types/auth/types";

type SuccessResponse = {
  success: false;
  message: string;
  data: {
    accessToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
      role: "User" | "Entrepreneur" | "Admin";
    };
  };
};

type ErrorResponse = {
  success: false;
  message: string;
  code?: "EMAIL_NOT_VERIFIED";
};

export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuthStore.getState();

  return useMutation<SuccessResponse, AxiosError<ErrorResponse>, LoginFormType>(
    {
      mutationFn: async (formData) => {
        const res = await axiosApi.post("/auth/login", formData);
        return res.data;
      },
      onSuccess: (data) => {
        if (!data.success) {
          toast.error(data.message ?? "Login Failed");
          return;
        }
        login(data.data);
        toast.success(data.message ?? "Login success.");
        navigate("/");
      },

      onError: (error) => {
        if (!error.response) {
          toast.error("Network error, please try again later.");
          return;
        }

        toast.error(error.response.data?.message ?? "Login Failed");
      },
    },
  );
}
