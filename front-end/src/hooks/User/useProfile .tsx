import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import type { UserProfileFormValues } from "../../components/forms/UserProfileForm";

export type Profile = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
};

type ApiResponse = {
  success: boolean;
  data: Profile;
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axiosApi.get<ApiResponse>("/users/profile");
      return data.data;
    },
  });
};

type ResponseType = {
  success: boolean;
  message: string;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    Partial<UserProfileFormValues>
  >({
    mutationFn: async (formData) => {
      const { data } = await axiosApi.patch<ResponseType>(
        "/users/profile",
        formData,
      );
      return data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Update failed");
        return;
      }

      toast.success(data.message ?? "Profile updated");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, try again");
        return;
      }

      toast.error(error.response.data?.message || "Failed to update profile");
    },
  });
};
