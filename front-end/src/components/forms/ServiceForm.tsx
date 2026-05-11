import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import InputField from "../Shared/InputField";
import SelectInput from "../Shared/SelectInput";
import Button from "../Shared/Button";

import {
  useCreateServices,
  useUpdateServices,
  type Service,
} from "../../hooks/Entrepreneur/useServices";
import {
  createServiceSchema,
  updateServiceSchema,
} from "../../schema/admin/service.schema";
import type { ServiceFormType } from "../../types/admin/types";

type Props = {
  service?: Service | null;
  closeSheet: () => void;
};

export default function ServiceForm({ service, closeSheet }: Props) {
  const createMutation = useCreateServices();
  const updateMutation = useUpdateServices();

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { isValid, errors, isDirty, dirtyFields },
  } = useForm({
    resolver: yupResolver(service ? updateServiceSchema : createServiceSchema),
    mode: "onChange",
    values: {
      title: service?.title || "",
      description: service?.description || "",
      price: service?.price || 0,
      priceUnit: service?.priceUnit || "per_service",
    },
  });

  const onSubmit = (data: ServiceFormType) => {
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
          error={errors.title}
          registration={register("title")}
        />

        <InputField
          label="Description"
          placeholder="Enter description"
          inputClassName="!py-2 !px-3 text-sm"
          error={errors.description}
          registration={register("description")}
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
          error={errors.price}
          registration={register("price")}
        />
      </div>

      <Button
        type="submit"
        label={service ? "Update Service" : "Save Service"}
        className="w-full"
        disabled={
          !isValid ||
          !isDirty ||
          (service ? updateMutation.isPending : createMutation.isPending)
        }
        isLoading={
          service ? updateMutation.isPending : createMutation.isPending
        }
      />
    </form>
  );
}
