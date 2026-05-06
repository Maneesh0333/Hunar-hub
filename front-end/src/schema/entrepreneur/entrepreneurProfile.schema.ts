import * as yup from "yup";

export const profileSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name cannot exceed 30 characters"),

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

  bio: yup
    .string()
    .trim()
    .max(30, "Bio must be at most 30 characters")
    .notRequired()
    .default(""),

  about: yup
    .string()
    .trim()
    .max(300, "About must be at most 300 characters")
    .notRequired()
    .default(""),

  city: yup
    .string()
    .trim()
    .max(30, "City is too long")
    .notRequired()
    .default(""),

  visitType: yup
    .array()
    .of(yup.string().oneOf(["visit_home", "visit_workshop"]))
    .max(2, "Max 2 visit type methods allowed")
    .notRequired()
    .default([]),

  skills: yup
    .string()
    .trim()
    .test("skills-validation", function (value) {
      if (!value) return true;

      const arr = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase());

      // Max limit
      if (arr.length > 20) {
        return this.createError({
          message: "You can add a maximum of 20 skills",
        });
      }

      // Duplicate check
      if (new Set(arr).size !== arr.length) {
        return this.createError({
          message: "Duplicate skills are not allowed",
        });
      }

      // Length validation
      const invalid = arr.find((s) => s.length < 2 || s.length > 30);
      if (invalid) {
        return this.createError({
          message: `Each skill must be between 2 and 30 characters (invalid: "${invalid}")`,
        });
      }

      return true;
    })
    .notRequired()
    .default(""),

  languages: yup
    .string()
    .trim()
    .test("languages-validation", function (value) {
      if (!value) return true;

      const arr = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase());

      // Max limit
      if (arr.length > 10) {
        return this.createError({
          message: "You can add a maximum of 10 languages",
        });
      }

      // Duplicate check
      if (new Set(arr).size !== arr.length) {
        return this.createError({
          message: "Duplicate skills are not allowed",
        });
      }

      // Length validation
      const invalid = arr.find((s) => s.length < 2 || s.length > 30);
      if (invalid) {
        return this.createError({
          message: `Each language must be between 2 and 30 characters (invalid: "${invalid}")`,
        });
      }

      return true;
    })
    .notRequired()
    .default(""),

  payment: yup
    .array()
    .of(yup.string().oneOf(["Cash", "UPI"]))
    .max(2, "Max 2 payment methods allowed")
    .notRequired()
    .default([]),

  category: yup.string().trim().notRequired().default(""),

  experienceYears: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .min(0, "Experience cannot be negative")
    .max(60, "Invalid experience value")
    .notRequired()
    .default(0),
});


