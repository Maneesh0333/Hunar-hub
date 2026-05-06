import * as yup from "yup";

export const reviewSchema = yup
  .object({
    bookingId: yup.string().required("Booking id is required"),
    rating: yup
      .number()
      .required("Please select a rating")
      .min(1, "Minimum 1 star")
      .max(5, "Maximum 5 stars"),

    comment: yup
      .string()
      .trim()
      .max(300, "Comment cannot exceed 300 characters")
      .optional()
  })
  .noUnknown(true, "Unknown fields are not allowed");
