import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm, useWatch } from "react-hook-form";
import InputField from "../Shared/InputField";
import SelectInput from "../Shared/SelectInput";
import Button from "../Shared/Button";

import {
  useCreateSchedule,
  useUpdateSchedule,
  type Schedule,
} from "../../hooks/Entrepreneur/useSchedule";
import {
  createScheduleSchema,
  updateScheduleSchema,
} from "../../schema/entrepreneur/schedule.schema";
import type { FormType } from "../../types/entrepreneur/types";

// Days
const dayOptions = [
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
  { label: "Sunday", value: "Sunday" },
];

type Props = {
  schedule: Schedule | null;
  closeSheet: () => void;
};

export default function ScheduleForm({ schedule, closeSheet }: Props) {
  const createMutation = useCreateSchedule();
  const updateMutation = useUpdateSchedule();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid, isDirty, dirtyFields },
  } = useForm({
    resolver: yupResolver(
      schedule ? updateScheduleSchema : createScheduleSchema,
    ),
    values: {
      day: schedule?.day || "",
      working: schedule?.working || false,
      start: schedule?.start || "09:00",
      end: schedule?.end || "17:00",
    },
    mode: "onChange",
  });

  console.log(schedule);

  const working = useWatch({
    control,
    name: "working",
  });

  const onSubmit = (data: FormType) => {
    if (schedule) {
      const dataMod = Object.fromEntries(
        Object.entries(data).filter(([key]) =>
          Object.keys(dirtyFields).includes(key),
        ),
      );

      updateMutation.mutate(
        {
          scheduleId: schedule?._id,
          dataMod,
        },
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
      <div className="flex flex-col gap-3">
        <Controller
          name="day"
          control={control}
          render={({ field, fieldState }) => (
            <SelectInput
              label="Day"
              options={dayOptions}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="working"
          control={control}
          render={({ field }) => (
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Working Day</label>
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                onBlur={field.onBlur}
              />
            </div>
          )}
        />

        {working && (
          <>
            <InputField
              label="Start Time"
              type="time"
              registration={register("start")}
              error={errors.start}
              inputClassName="!px-3 !py-2 text-sm"
            />

            <InputField
              label="End Time"
              type="time"
              registration={register("end")}
              error={errors.end}
              inputClassName="!px-3 !py-2 text-sm"
            />
          </>
        )}
      </div>

      <Button
        type="submit"
        label={schedule ? "Update Schedule" : "Add Schedule"}
        className="w-full"
        disabled={
          !isValid ||
          !isDirty ||
          (schedule ? updateMutation.isPending : createMutation.isPending)
        }
        isLoading={
          schedule ? updateMutation.isPending : createMutation.isPending
        }
      />
    </form>
  );
}
