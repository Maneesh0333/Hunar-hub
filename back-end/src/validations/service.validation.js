import * as yup from "yup";

export const createServiceSchema = yup
  .object({
    title: yup
      .string()
      .trim()
      .required("Service name is required")
      .min(2, "Service name must be at least 2 characters")
      .max(100, "Service name cannot exceed 100 characters"),

    description: yup
      .string()
      .trim()
      .required("Description is required")
      .max(1000, "Description cannot exceed 1000 characters"),

    price: yup
      .number()
      .typeError("Price must be a number")
      .required("Price is required")
      .min(0, "Price cannot be negative"),

    priceUnit: yup
      .string()
      .oneOf(["per_piece", "per_hour", "per_service"])
      .required("Price unit is required"),
  })
  .noUnknown(true, "Unknown fields are not allowed");

export const updateServiceSchema = yup
  .object({
    title: yup
      .string()
      .trim()
      .min(2, "Service name must be at least 2 characters")
      .max(100, "Service name cannot exceed 100 characters"),

    description: yup
      .string()
      .trim()
      .max(1000, "Description cannot exceed 1000 characters"),

    price: yup
      .number()
      .typeError("Price must be a number")
      .min(0, "Price cannot be negative"),

    priceUnit: yup.string().oneOf(["per_piece", "per_hour", "per_service"]),
  })
  .noUnknown(true, "Unknown fields are not allowed");
