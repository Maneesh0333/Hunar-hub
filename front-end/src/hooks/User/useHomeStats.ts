import { useQuery } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";

type HomeStats = {
  VerifiedArtisans: number;
  OrdersCompleted: number;
  Categories: number;
};

type HomeStatsResponse = {
  success: boolean;
  message: string;
  data: HomeStats;
};

export const useHomeStats = () => {
  return useQuery<HomeStats>({
    queryKey: ["home-stats"],
    queryFn: async () => {
      const { data } = await axiosApi.get<HomeStatsResponse>("/users/stats");
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });
};
