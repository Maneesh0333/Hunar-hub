import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import InputField from "../Shared/InputField";
import SelectInput from "../Shared/SelectInput";
import Button from "../Shared/Button";
import {
  useCreateCategories,
  useUpdateCategories,
  type Category,
} from "../../hooks/Admin/useCategories";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../../schema/admin/category.schema";
import type { CategoryFormType } from "../../types/admin/types";

type Props = {
  category?: Category | null;
  closeSheet: () => void;
};

export default function CategoryForm({ category, closeSheet }: Props) {
  const createMutation = useCreateCategories();
  const updateMutation = useUpdateCategories();

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
    values: {
      icon: category?.icon || "",
      name: category?.name || "",
      description: category?.description || "",
      status: category?.status || "Active",
    },
  });

  const onSubmit = (data: CategoryFormType) => {
    if (category) {
      const dirtyKeys = new Set(Object.keys(dirtyFields));

      const dataMod = Object.fromEntries(
        Object.entries(data).filter(([key]) => dirtyKeys.has(key)),
      );

      updateMutation.mutate(
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
          error={errors.icon}
          registration={register("icon")}
        />

        <InputField
          label="Category Name"
          placeholder="Enter category name"
          inputClassName="!py-2 !px-3 text-sm"
          error={errors.name}
          registration={register("name")}
        />

        <InputField
          label="Description"
          placeholder="Enter a description"
          inputClassName="!py-2 !px-3 text-sm"
          error={errors.description}
          registration={register("description")}
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
        disabled={
          !isValid ||
          !isDirty ||
          (category ? updateMutation.isPending : createMutation.isPending)
        }
        isLoading={
          category ? updateMutation.isPending : createMutation.isPending
        }
      />
    </form>
  );
}
