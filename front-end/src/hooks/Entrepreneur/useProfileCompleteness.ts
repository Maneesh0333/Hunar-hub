import { useQuery } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";

export type ProfileCompletenessItem = {
  label: string;
  value: string;
  completed: boolean;
};

export type ProfileCompleteness = {
  percentage: number;
  message: string;
  items: ProfileCompletenessItem[];
};

type ResponseType = {
  success: boolean;
  message: string;
  data: {
    profileCompleteness: ProfileCompleteness;
  };
};

export const useProfileCompleteness = () => {
  return useQuery({
    queryKey: ["profileCompleteness"],

    queryFn: async () => {
      const res = await axiosApi.get<ResponseType>(
        "/entrepreneurs/profile/completeness",
      );

      const completeness = res.data?.data?.profileCompleteness;

      return {
        percentage: completeness?.percentage ?? 0,
        items: completeness?.items ?? [],
        message: completeness?.message,
      };
    },

    initialData: {
      percentage: 0,
      items: [],
      message: ""
    },
  });
};
