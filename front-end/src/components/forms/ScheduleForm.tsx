import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import InputField from "../Shared/InputField";
import SelectInput from "../Shared/SelectInput";
import Button from "../Shared/Button";
import { useEffect } from "react";

import {
  useCreateSchedule,
  useUpdateSchedule,
  type Schedule,
} from "../../hooks/Entrepreneur/useSchedule";
import timeToMinutes from "../../utils/TimeToMinutes";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

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

export const createScheduleSchema = yup.object({
  day: yup.string().trim().oneOf(days, "Invalid day").required(),

  working: yup.boolean().required(),

  start: yup
    .string()
    .trim()
    .when("working", {
      is: true,
      then: (schema) =>
        schema
          .required("Start time is required")
          .matches(timeRegex, "Invalid time format HH:mm"),
      otherwise: (schema) => schema.notRequired(),
    }),

  end: yup
    .string()
    .trim()
    .when("working", {
      is: true,
      then: (schema) =>
        schema
          .required("End time is required")
          .matches(timeRegex, "Invalid time format HH:mm")
          .test(
            "is-after-start",
            "End time must be after start time",
            function (value) {
              const { start } = this.parent;
              if (!start || !value) return true;
              return timeToMinutes(value) > timeToMinutes(start);
            },
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
});

export const updateScheduleSchema = yup.object({
  day: yup.string().trim().oneOf(days, "Invalid day"),

  working: yup.boolean(),

  start: yup
    .string()
    .trim()
    .when("working", {
      is: true,
      then: (schema) =>
        schema
          .required("Start time is required")
          .matches(timeRegex, "Invalid time format HH:mm"),
      otherwise: (schema) =>
        schema
          .notRequired()
          .test("valid-time", "Invalid time format HH:mm", (value) => {
            if (!value) return true;
            return timeRegex.test(value);
          }),
    }),

  end: yup
    .string()
    .trim()
    .when("working", {
      is: true,
      then: (schema) =>
        schema
          .required("End time is required")
          .matches(timeRegex, "Invalid time format HH:mm")
          .test(
            "is-after-start",
            "End time must be after start time",
            function (value) {
              const { start } = this.parent;
              if (!start || !value) return true;
              return timeToMinutes(value) > timeToMinutes(start);
            },
          ),
      otherwise: (schema) =>
        schema
          .notRequired()
          .test("valid-time", "Invalid time format HH:mm", (value) => {
            if (!value) return true;
            return timeRegex.test(value);
          }),
    }),
});

export type CreateScheduleSchemaType = yup.InferType<
  typeof createScheduleSchema
>;

export type UpdateScheduleSchemaType = yup.InferType<
  typeof updateScheduleSchema
>;

export type FormType = CreateScheduleSchemaType | UpdateScheduleSchemaType;

type Props = {
  schedule?: Schedule | null;
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
    watch,
    formState: { errors, isValid, isDirty, dirtyFields },
  } = useForm({
    resolver: yupResolver(
      schedule ? updateScheduleSchema : createScheduleSchema,
    ),
    mode: "onChange",
    defaultValues: {
      working: true,
      start: "09:00",
      end: "17:00",
    },
  });

  const working = watch("working");

  useEffect(() => {
    if (schedule) {
      reset({
        day: schedule.day,
        working: schedule.working,
        start: schedule.start,
        end: schedule.end,
      });
    } else {
      reset({
        working: true,
        start: "09:00",
        end: "17:00",
      });
    }
  }, [schedule, reset]);

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

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Working Day</label>
          <input type="checkbox" {...register("working")} />
        </div>

      
        {working && (
          <>
            <InputField
              label="Start Time"
              type="time"
              name="start"
              register={register}
              errors={errors}
              inputClassName="!px-3 !py-2 text-sm"
            />

            <InputField
              label="End Time"
              type="time"
              name="end"
              register={register}
              errors={errors}
              inputClassName="!px-3 !py-2 text-sm"
            />
          </>
        )}
      </div>

      <Button
        type="submit"
        label={schedule ? "Update Schedule" : "Add Schedule"}
        className="w-full"
        disabled={!isValid || !isDirty}
        isLoading={
          schedule ? updateMutation.isPending : createMutation.isPending
        }
      />
    </form>
  );
}
