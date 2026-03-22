import { useQuery } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";

export type EntrepreneurCard = {
  _id: string;
  bio: string;
  skills: string[];
  city: string;
  name: string;
  category: string;
  rating: number;
  totalReviews: number;
  minPrice: number;
  priceUnit: string;
  isAvailableToday: boolean;
};

export type SearchResponse = {
  success: boolean;
  data: {
    entrepreneurs: EntrepreneurCard[];
    totalFiltered: { count: number }[];
  };
};

export const useSearchEntrepreneurs = (
  search: string,
  category?: string,
  page?: number,
  limit?: number,
) => {
  return useQuery({
    queryKey: ["entrepreneurs-search", search, category, page, limit],

    queryFn: async () => {
      const { data } = await axiosApi.get<SearchResponse>(
        "/entrepreneurs/search/profile",
        { params: { search, category, page, limit } },
      );

      return {
        entrepreneurs: data.data.entrepreneurs,
        total: data.data.totalFiltered?.[0]?.count ?? 0,
      };
    },

    placeholderData: (prev) => prev,
  });
};
