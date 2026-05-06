import * as yup from "yup";

export const reviewSchema = yup.object({
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
    .default(""),
});

