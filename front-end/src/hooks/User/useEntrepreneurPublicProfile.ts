import { useQuery } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";

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
    city: string;
  };

  bio: string;
  about: string;
  visitType: string[];
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

export const useEntrepreneurPublicProfile = (id: string | undefined) => {
  return useQuery({
    queryKey: ["entrepreneur-public-profile", id],
    queryFn: async () => {
      const res = await axiosApi.get<ResponseTypeApi>(
        `/entrepreneurs/public/profile/${id}`,
      );
      return res.data?.data;
    },
    enabled: !!id,
  });
};
