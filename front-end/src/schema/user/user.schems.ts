import * as yup from "yup";

export const userProfileSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long"),

  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Invalid email"),

  phone: yup
    .string()
    .trim()
    .required("Phone is required")
    .matches(/^[0-9]{10,15}$/, "Invalid phone number"),

  city: yup.string().trim().max(30, "City is too long").optional().default(""),
});

