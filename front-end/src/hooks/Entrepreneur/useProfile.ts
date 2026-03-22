import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import type { ProfileFormValues } from "../../components/forms/EntrepreneurProfileForm";

export type EntrepreneurProfile = {
  _id: string;

  rating: {
    average: number;
    totalReviews: number;
  };

  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };

  bio: string;
  about: string;
  city: string;

  skills: string[];
  payment: string[];
  category: {
    _id: string;
    name: string;
  };
  languages: string[];

  experienceYears: number;

  totalOrders: number;
  completedOrders: number;

  createdAt: string;
};

type ResponseTypeApi = {
  success: boolean;
  message: string;
  data: EntrepreneurProfile;
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["entrepreneurProfile"],
    queryFn: async () => {
      const res = await axiosApi.get<ResponseTypeApi>("/entrepreneurs/profile");
      return res.data?.data;
    },
  });
};

type ResponseType = {
  success: boolean;
  message: string;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, any>({
    mutationFn: async (data) => {
      const res = await axiosApi.patch<ResponseType>(
        "/entrepreneurs/profile",
        data,
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data?.message || "Profile updation failed.");
        return;
      }
      toast.success(data.message || "Profile updated.");
      queryClient.invalidateQueries({ queryKey: ["entrepreneurProfile"] });
      queryClient.invalidateQueries({ queryKey: ["profileCompleteness"] });
    },
    onError: (err) => {
      if (!err.response) {
        toast.error("Network error, Please try again later.");
        return;
      }
      toast.error(err.response?.data?.message || "Profile updation failed.");
    },
  });
};
