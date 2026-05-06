import { useInfiniteQuery } from "@tanstack/react-query";
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
  verificationStatus: "Pending" | "Approved" | "Rejected";
};

export type SearchAPIResponse = {
  success: boolean;
  data: {
    entrepreneurs: EntrepreneurCard[];
    totalFiltered: { count: number }[];
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};

export const useSearchEntrepreneurs = (
  search: string = "",
  category: string = "All",
  rating: string = "Any",
  availableToday: boolean = false,
  homeService: boolean = false,
  limit: number = 5,
) => {
  return useInfiniteQuery<SearchAPIResponse, Error>({
    queryKey: [
      "entrepreneurs-search",
      search,
      category,
      rating,
      availableToday,
      homeService,
    ],

    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axiosApi.get<SearchAPIResponse>(
        "/entrepreneurs/search/profile",
        {
          params: {
            search,
            category,
            rating,
            page: pageParam,
            limit,
            availableToday,
            homeService,
          },
        },
      );

      return data;
    },

    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined;
    },

    initialPageParam: 1,
  });
};
