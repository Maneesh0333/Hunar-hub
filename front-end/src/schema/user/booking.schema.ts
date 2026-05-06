import * as yup from "yup";

export const bookingSchema = yup.object({
  service: yup.string().trim().required("Service name is required"),

  requirements: yup
    .string()
    .trim()
    .max(300, "requirements cannot exceed 300 characters")
    .optional()
    .default(""),

  visitType: yup
    .string()
    .oneOf(["visit_home", "visit_workshop"])
    .required("Visit Type is required"),
});

