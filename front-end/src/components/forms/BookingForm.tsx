import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import SelectInput from "../Shared/SelectInput";
import Button from "../Shared/Button";

import { usePublicServices } from "../../hooks/User/usePublicServices ";
import { useCreateBooking } from "../../hooks/User/useBooking";

export const bookingSchema = yup.object({
  service: yup.string().trim().required("Service name is required"),

  requirements: yup
    .string()
    .trim()
    .max(300, "requirements cannot exceed 300 characters")
    .optional()
    .default(""),

  visitType: yup
    .string()
    .oneOf(["visit_home", "visit_workshop"])
    .required("Visit Type is required"),
});

export type bookingSchemaType = yup.InferType<typeof bookingSchema>;

type Props = {
  servicesId: string | undefined;
  closeSheet: () => void;
};

export default function BookingForm({ servicesId, closeSheet }: Props) {
  const { data, isLoading } = usePublicServices(servicesId);
  const services = data ?? [];

  const BookingMutation = useCreateBooking();

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { isValid, errors },
  } = useForm<bookingSchemaType>({
    resolver: yupResolver(bookingSchema),
    mode: "onChange",
    defaultValues: {
      service: "",
      requirements: "",
      visitType: "visit_workshop",
    },
  });

  const onSubmit = (data: bookingSchemaType) => {
    BookingMutation.mutate(data, {
      onSuccess: ()=>{
        reset();
        closeSheet();
      }
    })
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-full justify-between"
    >
      <div className="flex flex-col gap-2">
        <Controller
          name="service"
          control={control}
          render={({ field, fieldState }) => (
            <SelectInput
              label="Service"
              value={field.value}
              onChange={field.onChange}
              options={services?.map((service) => ({
                label: service.title,
                value: service._id,
              }))}
              error={fieldState.error?.message}
              isLoading={isLoading}
            />
          )}
        />

        <Controller
          name="visitType"
          control={control}
          render={({ field, fieldState }) => (
            <SelectInput
              label="Visit Type"
              value={field.value}
              onChange={field.onChange}
              options={[
                { label: "I visit the workshop", value: "visit_workshop" },
                { label: "Artisan visit my home", value: "visit_home" },
              ]}
              error={fieldState.error?.message}
            />
          )}
        />

        <div>
          <label className="text-xs font-semibold tracking-wide text-[var(--clay)]">
            Requirements
          </label>

          <div
            className={`mt-2 w-full pl-3 pr-1 py-2 rounded-xl text-sm
  border border-[rgba(196,99,42,0.2)]
  focus-within:outline-none focus-within:border-[var(--clay)]
  bg-white`}
          >
            <textarea
              rows={3}
              className="w-full bg-transparent outline-none resize-none"
              {...register("requirements")}
              placeholder="Fabric details, measurements, design preferences, or upload a photo reference…"
            />
          </div>
          {errors.requirements && (
            <p className="text-xs text-red-500 mt-1">
              {errors.requirements.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        label={"Book Now"}
        className="w-full"
        disabled={!isValid}
        isLoading={BookingMutation.isPending}
      />
    </form>
  );
}
