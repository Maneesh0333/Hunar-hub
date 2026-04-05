import * as yup from "yup";

export const updateEntrepreneurProfileSchema = yup
  .object({
    name: yup
      .string()
      .trim()
      .max(30, "Name must be at most 30 characters")
      .test("non-empty", "Name cannot be empty", (value) => {
        if (value === undefined) return true;
        return value.length > 0;
      }),

    email: yup.string().trim().email("Invalid email format"),

    phone: yup
      .string()
      .trim()
      .matches(
        /^[0-9]{10,15}$/,
        "Phone number must be between 10 and 15 digits",
      ),

    bio: yup.string().trim().max(30, "Bio cannot exceed 30 characters"),

    about: yup
      .string()
      .trim()
      .max(300, "About section cannot exceed 300 characters"),

    city: yup
      .string()
      .trim()
      .max(30, "City name must be at most 30 characters"),

    skills: yup
      .array()
      .of(
        yup
          .string()
          .trim()
          .min(2, "Skill must be at least 2 characters")
          .max(30, "Skill must be at most 30 characters")
          .transform((value) =>
            value
              ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
              : value,
          ),
      )
      .max(20, "You can add a maximum of 20 skills")
      .test("unique", function (arr) {
        if (!arr || arr.length === 0) return true;

        // If size is NOT equal to length, there are duplicates
        if (new Set(arr).size !== arr.length) {
          return this.createError({
            message: "Duplicate skills not allowed",
          });
        }

        return true;
      }),

    visitType: yup
      .array()
      .of(yup.string().oneOf(["visit_home", "visit_workshop"]))
      .max(2, "Max 2 visit type methods allowed")
      .notRequired(),

    payment: yup
      .array()
      .of(yup.string().oneOf(["Cash", "UPI"], "Invalid payment method"))
      .max(2, "You can select up to 2 payment methods")
      .test(
        "unique",
        "Duplicate payment methods not allowed",
        (arr) => !arr || new Set(arr).size === arr.length,
      ),

    category: yup.string(),

    experienceYears: yup
      .number()
      .typeError("Experience Years must be a number")
      .min(0, "Experience cannot be negative")
      .max(60, "Experience cannot exceed 60 years"),

    languages: yup
      .array()
      .of(
        yup
          .string()
          .trim()
          .min(2, "Language name must be at least 2 characters")
          .max(50, "Language name must be at most 50 characters")
          .transform((value) =>
            value
              ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
              : value,
          ),
      )
      .max(10, "You can add up to 10 languages")
      .test("unique", function (arr) {
        if (!arr || arr.length === 0) return true;

        // If size is NOT equal to length, there are duplicates
        if (new Set(arr).size !== arr.length) {
          return this.createError({
            message: "Duplicate languages not allowed",
          });
        }

        return true;
      }),
  })
  .noUnknown(true, "Unknown fields are not allowed");
