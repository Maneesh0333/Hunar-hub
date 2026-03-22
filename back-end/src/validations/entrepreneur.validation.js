import * as yup from "yup";

export const updateEntrepreneurProfileSchema = yup
  .object({
    name: yup
      .string()
      .trim()
      .max(30)
      .test("non-empty", "Name cannot be empty", (value) => {
        if (value === undefined) return true;
        return value.length > 0;
      }),

    email: yup.string().trim().email("Invalid email format"),
    phone: yup
      .string()
      .trim()
      .matches(/^[0-9]{10,15}$/, "Invalid phone number"),

    bio: yup.string().trim().max(30),

    about: yup.string().trim().max(300),

    city: yup.string().trim().max(30),

    skills: yup.array().of(yup.string().trim().min(2).max(30)).max(20),

    payment: yup
      .array()
      .of(
        yup
          .string()
          .oneOf(
            ["Cash", "UPI", "Card", "Bank Transfer"],
            "Invalid payment method",
          ),
      )
      .max(5)
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
      .max(60, "Experience cannot be above 60"),

    languages: yup
      .array()
      .of(yup.string().trim().min(2).max(50))
      .max(10)
      .test(
        "unique",
        "Duplicate languages not allowed",
        (arr) => !arr || new Set(arr).size === arr.length,
      ),
  })
  .noUnknown(true, "Unknown fields are not allowed");
