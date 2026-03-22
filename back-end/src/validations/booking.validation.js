import * as yup from "yup";

export const bookingSchema = yup
  .object({
    service: yup.string().trim().required("ServiceId is required"),

    requirements: yup
      .string()
      .trim()
      .max(300, "Requirements cannot exceed 300 characters")
      .optional()
      .transform((value) => (value === "" ? undefined : value)),

    visitType: yup
      .string()
      .required("Visit Type is required")
      .oneOf(
        ["visit_home", "visit_workshop"],
        "Please select a valid visit type",
      )
      .default("visit_workshop"),
  })
  .stripUnknown(true);
