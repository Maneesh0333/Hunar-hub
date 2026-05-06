import * as yup from "yup";
import timeToMinutes from "../../utils/TimeToMinutes";

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
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

