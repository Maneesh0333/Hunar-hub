import * as yup from "yup";

export const registerSchema = yup
  .object({
    name: yup
      .string()
      .trim()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name is too long"),

    email: yup
      .string()
      .trim()
      .email("Invalid email format")
      .required("Email is required")
      .transform((value) => value.toLowerCase()),

    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Za-z]/, "Password must contain at least one letter")
      .matches(/[0-9]/, "Password must contain at least one number"),

    phone: yup
      .string()
      .required("Phone number is required")
      .matches(/^[0-9]{10,15}$/, "Invalid phone number"),

    signupAs: yup
      .string()
      .oneOf(["User", "Entrepreneur"], "Invalid signup type")
      .required("signup type is required"),
  })
  .strict(true)
  .noUnknown(true, "Unknown fields are not allowed");

export const loginSchema = yup
  .object({
    email: yup
      .string()
      .trim()
      .email("Invalid email format")
      .required("Email is required")
      .transform((value) => value.toLowerCase()),

    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Za-z]/, "Password must contain at least one letter")
      .matches(/[0-9]/, "Password must contain at least one number"),
  })
  .noUnknown(true, "Unknown fields are not allowed");

export const verifyOtpSchema = yup
  .object({
    email: yup.string().required("Email is required").email("Invalid email"),

    otp: yup
      .string()
      .required("OTP is required")
      .length(6, "OTP must be exactly 6 digits")
      .matches(/^\d+$/, "OTP must contain only numbers"),
  })
  .noUnknown(true, "Unknown fields are not allowed");
