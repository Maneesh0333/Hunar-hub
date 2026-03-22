import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useEffect } from "react";

import InputField from "../Shared/InputField";
import SelectInput from "../Shared/SelectInput";
import Button from "../Shared/Button";

import {
  useCreateServices,
  useUpdateServices,
  type Service,
} from "../../hooks/Entrepreneur/useServices";
import { useAllCategories } from "../../hooks/Admin/useCategories";

export const createServiceSchema = yup.object({
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
    .transform((value, currentValue) =>
      currentValue === "" ? undefined : value,
    )
    .required("Price is required")
    .min(0, "Price cannot be negative"),

  priceUnit: yup
    .string()
    .oneOf(["per_piece", "per_hour", "per_service"])
    .required("Price unit is required"),

  category: yup.string().trim().required("Category is required"),

  deliveryTime: yup
    .string()
    .trim()
    .max(50, "Delivery time is too long")
    .optional(),
});

export const updateServiceSchema = yup.object({
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
    .transform((value, currentValue) =>
      currentValue === "" ? undefined : value,
    )
    .min(0, "Price cannot be negative"),

  priceUnit: yup.string().oneOf(["per_piece", "per_hour", "per_service"]),

  category: yup.string().trim(),

  deliveryTime: yup.string().trim().max(50, "Delivery time is too long"),
});

export type CreateServiceSchemaType = yup.InferType<typeof createServiceSchema>;
export type UpdateServiceSchemaType = yup.InferType<typeof updateServiceSchema>;

export type FormType = CreateServiceSchemaType | UpdateServiceSchemaType;

type Props = {
  service?: Service | null;
  closeSheet: () => void;
};

export default function ServiceForm({ service, closeSheet }: Props) {
  const createMutation = useCreateServices();
  const updateMutation = useUpdateServices();

  const { data, isLoading } = useAllCategories();

  const categories = data ?? [];

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { isValid, errors, isDirty, dirtyFields },
  } = useForm({
    resolver: yupResolver(service ? updateServiceSchema : createServiceSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      priceUnit: "per_service",
      category: "",
      deliveryTime: "",
    },
  });

  useEffect(() => {
    if (service) {
      reset({
        title: service.title,
        description: service.description,
        price: service.price,
        priceUnit: service.priceUnit,
        category: service.category,
        deliveryTime: service.deliveryTime,
      });
    } else {
      reset({
        title: "",
        description: "",
        price: 0,
        priceUnit: "per_service",
        category: "",
        deliveryTime: "",
      });
    }
  }, [service, reset]);

  const onSubmit = (data: FormType) => {
    if (service) {
      const dataMod = Object.fromEntries(
        Object.entries(data).filter(([key]) =>
          Object.keys(dirtyFields).includes(key),
        ),
      );

      updateMutation.mutate(
        { serviceId: service._id, dataMod },
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
          label="Service Title"
          placeholder="Enter service title"
          inputClassName="!py-2 !px-3 text-sm"
          name="title"
          errors={errors}
          register={register}
        />

        <Controller
          name="category"
          control={control}
          render={({ field, fieldState }) => (
            <SelectInput
              label="Category"
              value={field.value ?? ""}
              onChange={(val) => field.onChange(val || undefined)}
              options={categories.map((cat) => ({
                label: cat.name,
                value: cat._id,
              }))}
              error={fieldState.error?.message}
              isLoading={isLoading}
            />
          )}
        />

        <InputField
          label="Description"
          placeholder="Enter description"
          inputClassName="!py-2 !px-3 text-sm"
          name="description"
          errors={errors}
          register={register}
        />

        <Controller
          name="priceUnit"
          control={control}
          render={({ field, fieldState }) => (
            <SelectInput
              label="Price Unit"
              value={field.value}
              onChange={field.onChange}
              options={[
                { label: "Per Piece", value: "per_piece" },
                { label: "Per Hour", value: "per_hour" },
                { label: "Per Service", value: "per_service" },
              ]}
              error={fieldState.error?.message}
            />
          )}
        />

        <InputField
          label="Price"
          placeholder="Enter price"
          type="number"
          inputClassName="!py-2 !px-3 text-sm"
          name="price"
          errors={errors}
          register={register}
        />
      </div>

      <Button
        type="submit"
        label={service ? "Update Service" : "Save Service"}
        className="w-full"
        disabled={!isValid || !isDirty}
        isLoading={
          service ? updateMutation.isPending : createMutation.isPending
        }
      />
    </form>
  );
}
