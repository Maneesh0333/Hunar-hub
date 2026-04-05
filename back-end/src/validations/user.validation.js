import * as yup from "yup";

export const updateProfileSchema = yup
  .object({
    name: yup
      .string()
      .trim()
      .transform((v) => (v === "" ? undefined : v))
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name is too long"),

    email: yup
      .string()
      .trim()
      .transform((v) => (v === "" ? undefined : v))
      .email("Invalid email format")
      .lowercase(),

    phone: yup
      .string()
      .trim()
      .transform((v) => (v === "" ? undefined : v))
      .matches(/^[6-9]\d{9,14}$/, "Invalid phone number"),

    city: yup
      .string()
      .trim()
      .transform((v) => (v === "" ? undefined : v))
      .min(3, "City must be at least 3 characters")
      .max(30, "City is too long"),
  })
  .noUnknown(true, "Unknown fields are not allowed");
