import * as yup from "yup";

export const complaintSchema = yup.object({
  type: yup.string().required("Please select an issue category"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Please provide at least 10 characters")
    .max(500, "Maximum 500 characters"),
});

