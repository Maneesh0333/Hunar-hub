import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import InputField from "../Shared/InputField";
import Button from "../Shared/Button";
import { useCreateComplaint } from "../../hooks/Shared/useComplaints";
import SelectInput from "../Shared/SelectInput";
import type { ComplaintFormType } from "../../types/user/types";
import { complaintSchema } from "../../schema/user/complaint.schema";

type Props = {
  booking: string;
  closeSheet: () => void;
};

export default function ComplaintForm({ booking, closeSheet }: Props) {
  const createComplaint = useCreateComplaint();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<ComplaintFormType>({
    resolver: yupResolver(complaintSchema),
    mode: "onChange",
    values:{
      type: "",
      description: ""
    }
  });

  const onSubmit = (data: ComplaintFormType) => {
    createComplaint.mutate(
      { booking, ...data },
      {
        onSuccess: () => {
          reset();
          closeSheet();
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full flex-col justify-between gap-6"
    >
      <div className="flex flex-col gap-5">
        <Controller
          name="type"
          control={control}
          render={({ field, fieldState }) => (
            <SelectInput
              label="Category"
              value={field.value ?? ""}
              onChange={(val) => field.onChange(val || undefined)}
              options={[
                { label: "Late Service", value: "Late Service" },
                { label: "Poor Quality", value: "Poor Quality" },
                {
                  label: "Professionalism Issue",
                  value: "Professionalism Issue",
                },
                { label: "Incorrect Charges", value: "Incorrect Charges" },
                { label: "Other", value: "Other" },
              ]}
              error={fieldState.error?.message}
            />
          )}
        />

        <InputField
          label="Tell us what happened"
          placeholder="Provide details about the issue..."
          error={errors.description}
          registration={register("description")}
          inputClassName="!py-2 !px-3 text-sm"
        />
      </div>

      <Button
        type="submit"
        label="Submit Complaint"
        className="w-full"
        disabled={!isValid || createComplaint.isPending}
        isLoading={createComplaint.isPending}
      />
    </form>
  );
}
