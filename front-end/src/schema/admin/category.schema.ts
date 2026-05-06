import * as yup from "yup";

export const createCategorySchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Category name is required")
    .min(2, "Category name must be at least 2 characters")
    .max(30, "Category name cannot exceed 30 characters"),

  icon: yup
    .string()
    .trim()
    .required("Icon is required")
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
    .max(100, "Description cannot exceed 100 characters")
    .optional()
    .default(""),

  status: yup
    .mixed<"Active" | "Inactive">()
    .oneOf(["Active", "Inactive"])
    .required()
    .default("Active"),
});

export const updateCategorySchema = yup.object({
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
    .max(100, "Description cannot exceed 100 characters")
    .default(""),

  status: yup
    .mixed<"Active" | "Inactive">()
    .oneOf(["Active", "Inactive"])
    .default("Active"),
});

export type CreateCategorySchemaType = yup.InferType<
  typeof createCategorySchema
>;
export type UpdateCategorySchemaType = yup.InferType<
  typeof updateCategorySchema
>;

