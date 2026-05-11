import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import axiosApi from "../../lib/axios";

type PortfolioResponse = {
  success: boolean;
  message: string;
};

export const useCreateUpdatePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PortfolioResponse,
    AxiosError<PortfolioResponse>,
    FormData
  >({
    mutationFn: async (payload) => {
      const res = await axiosApi.post<PortfolioResponse>(
        "/entrepreneurs/portfolio",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || "Failed to create portfolio");
        return;
      }

      toast.success(data.message || "Portfolio created successfully");

      queryClient.invalidateQueries({
        queryKey: ["portfolio"],
      });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later");
        return;
      }

      toast.error(error.response.data?.message || "Failed to create portfolio");
    },
  });
};

export type Portfolio = {
  _id: string;
  entrepreneur: string;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  createdAt: string;
};

type PortApifolioResponse = PortfolioResponse & {
  data: Portfolio;
};

export const usePortfolio = (
  page: "Entrepreneur" | "User",
  EntrepreneurId?: string,
) => {
  return useQuery<Portfolio, AxiosError<PortfolioResponse>>({
    queryKey: ["portfolio"],

    queryFn: async () => {
      if (page === "Entrepreneur") {
        const res = await axiosApi.get<PortApifolioResponse>(
          "/entrepreneurs/portfolio",
        );
        return res.data.data;
      } else {
        const res = await axiosApi.get<PortApifolioResponse>(
          `/entrepreneurs/portfolio/${EntrepreneurId}`,
        );
        return res.data.data;
      }
    },
    enabled: !!EntrepreneurId,
  });
};
