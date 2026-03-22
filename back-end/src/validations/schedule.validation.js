import * as yup from "yup";
import timeToMinutes from "../utils/TimeToMinutes.js";

// Constants
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

// Helper: safe time validation
const isValidTime = (value) => {
  if (value === undefined || value === null || value === "") return true;
  if (typeof value !== "string") return false;
  return timeRegex.test(value);
};

// Helper: reusable time field
const timeField = () =>
  yup
    .string()
    .trim()
    .test("valid-time", "Invalid time format HH:mm", isValidTime);

// Helper: end > start validation
const isAfterStart = function (value) {
  const { start } = this.parent;

  if (!value) return true;
  if (!start) return true;

  return timeToMinutes(value) > timeToMinutes(start);
};

export const createScheduleSchema = yup
  .object({
    day: yup
      .string()
      .trim()
      .oneOf(days, "Invalid day")
      .required("Day is required"),

    working: yup.boolean().required("Working is required"),

    start: timeField().when("working", {
      is: (val) => val === true,
      then: (schema) =>
        schema
          .required("Start time is required")
          .matches(timeRegex, "Invalid time format HH:mm"),
      otherwise: (schema) => schema.strip(), // 🔥 remove if not working
    }),

    end: timeField().when("working", {
      is: (val) => val === true,
      then: (schema) =>
        schema
          .required("End time is required")
          .matches(timeRegex, "Invalid time format HH:mm")
          .test(
            "is-after-start",
            "End time must be after start time",
            isAfterStart,
          ),
      otherwise: (schema) => schema.strip(),
    }),
  })
  .noUnknown(true, "Unknown fields are not allowed");

export const updateScheduleSchema = yup
  .object({
    day: yup.string().trim().oneOf(days, "Invalid day"),

    working: yup.boolean(),

    start: yup
      .string()
      .trim()
      .test("valid-time", "Invalid time format HH:mm", isValidTime)

      .matches(timeRegex, "Invalid time format HH:mm"),

    end: yup
      .string()
      .trim()
      .test("valid-time", "Invalid time format HH:mm", isValidTime)
      .matches(timeRegex, "Invalid time format HH:mm"),
  })
  .noUnknown(true, "Unknown fields are not allowed");
