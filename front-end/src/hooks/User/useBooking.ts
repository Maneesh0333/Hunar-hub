import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { bookingSchemaType } from "../../components/forms/BookingForm";
import axiosApi from "../../lib/axios";
import toast from "react-hot-toast";

export type ResponseType = {
  success: boolean;
  message: string;
};

export const useCreateBooking = () => {

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    bookingSchemaType
  >({
    mutationFn: async (formData) => {
      const { data } = await axiosApi.post<ResponseType>(
        "/bookings",
        formData,
      );
      return data;
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Booking Failed.");
        return;
      }
      toast.success(data.message ?? "Booked successfully");
    },
    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, try again later");
        return;
      }
      toast.error(error.response.data?.message ?? "Booking Failed.");
    },
  });
};