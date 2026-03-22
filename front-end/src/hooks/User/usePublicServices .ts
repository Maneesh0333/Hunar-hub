import { useQuery } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";

export type Service = {
  _id: string;
  title: string;
  description: string;
  price: number;
  priceUnit: string;
  deliveryTime: string;
};

type ResponseType = {
  success: boolean;
  data: Service[];
};

export const usePublicServices = (entrepreneurId: string | undefined) => {
  return useQuery({
    queryKey: ["public-services", entrepreneurId],
    queryFn: async () => {
      const res = await axiosApi.get<ResponseType>(
        `/services/public/${entrepreneurId}`
      );
      return res.data.data;
    },
    enabled: !!entrepreneurId,
  });
};
