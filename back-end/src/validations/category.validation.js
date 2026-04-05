import * as yup from "yup";

export const createCategorySchema = yup
  .object({
    name: yup
      .string()
      .trim()
      .required("Category name is required")
      .min(2)
      .max(30),

    icon: yup
      .string()
      .trim()
      .test("is-single-emoji", "Please add exactly one icon", (val) => {
        if (!val) return true;
        const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
        const count = [...segmenter.segment(val)].length;
        return count === 1;
      }),

    description: yup.string().trim().max(100).notRequired(),

    status: yup.string().oneOf(["Active", "Inactive"]).default("Active"),
  })
  .noUnknown(true, "Unknown fields are not allowed");

export const updateCategorySchema = yup
  .object({
    name: yup
      .string()
      .trim()
      .min(2, "Category name must be at least 2 characters")
      .max(30, "Category name cannot exceed 30 characters"),

    icon: yup
      .string()
      .trim()
      // Use a custom test to count actual visual emojis
      .test("is-single-emoji", "Please add exactly one icon", (val) => {
        if (!val) return false;
        // This splits the string by visual characters (graphemes)
        const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
        const count = [...segmenter.segment(val)].length;
        return count === 1;
      }),

    description: yup
      .string()
      .trim()
      .max(100, "Description cannot exceed 100 characters"),

    status: yup.string().oneOf(["Active", "Inactive"], "Invalid status"),
  })
  .noUnknown(true, "Unknown fields are not allowed");
