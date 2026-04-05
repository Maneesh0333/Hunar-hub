import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import InputField from "../Shared/InputField";
import SelectInput from "../Shared/SelectInput";
import Button from "../Shared/Button";
import {
  useCreateCategories,
  useUpdateCategories,
  type Category,
} from "../../hooks/Admin/useCategories";
import { useEffect } from "react";

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

export type FormType = CreateCategorySchemaType | UpdateCategorySchemaType;

type Props = {
  category?: Category | null;
  closeSheet: () => void;
};

export default function CategoryForm({ category, closeSheet }: Props) {
  const createMutation = useCreateCategories();
  const updateMudation = useUpdateCategories();

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { isValid, errors, isDirty, dirtyFields },
  } = useForm({
    resolver: yupResolver(
      category ? updateCategorySchema : createCategorySchema,
    ),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      status: "Active",
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description,
        status: category.status,
      });
    } else {
      reset({
        name: "",
        description: "",
        status: "Active",
      });
    }
  }, [category, reset]);

  const onSubmit = (data: FormType) => {
    if (category) {
      const dataMod = Object.fromEntries(
        Object.entries(data).filter(([key]) =>
          Object.keys(dirtyFields).includes(key),
        ),
      );

      updateMudation.mutate(
        { dataMod, categoryId: category._id },
        {
          onSuccess: () => {
            reset();
            closeSheet();
          },
        },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          reset();
          closeSheet();
        },
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-full justify-between"
    >
      <div className="flex flex-col gap-2">
        <InputField
          label="Icon"
          placeholder="Paste a Emoji"
          inputClassName="!py-2 !px-3 text-sm"
          name="icon"
          errors={errors}
          register={register}
        />

        <InputField
          label="Category Name"
          placeholder="Enter category name"
          inputClassName="!py-2 !px-3 text-sm"
          name="name"
          errors={errors}
          register={register}
        />

        <InputField
          label="Description"
          placeholder="Enter a description"
          inputClassName="!py-2 !px-3 text-sm"
          name="description"
          errors={errors}
          register={register}
        />

        <Controller
          name="status"
          control={control}
          render={({ field, fieldState }) => (
            <SelectInput
              label="Status"
              value={field.value}
              onChange={field.onChange}
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      <Button
        type="submit"
        label={category ? "Update Category" : "Save Category"}
        className="w-full"
        disabled={!isValid || !isDirty || category ? updateMudation.isPending : createMutation.isPending}
        isLoading={
          category ? updateMudation.isPending : createMutation.isPending
        }
      />
    </form>
  );
}
