import * as yup from "yup";

export const updateProfileSchema = yup
  .object({
    name: yup
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name is too long"),

    email: yup
      .string()
      .trim()
      .email("Invalid email format")
      .lowercase()
      .transform((value) => value?.toLowerCase()),

    phone: yup
      .string()
      .matches(/^[0-9]{10,15}$/, "Invalid phone number"),

    city: yup
      .string()
      .trim()
      .min(3, "City must be at least 3 characters")
      .max(30, "City is too long"),
  })
  .noUnknown(true, "Unknown fields are not allowed");
