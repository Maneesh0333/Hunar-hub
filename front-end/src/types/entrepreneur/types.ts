import * as yup from "yup";
import type { CreateScheduleSchemaType, UpdateScheduleSchemaType } from "../../schema/entrepreneur/schedule.schema";
import type { profileSchema } from "../../schema/entrepreneur/entrepreneurProfile.schema";

export type ProfileFormValues = yup.InferType<typeof profileSchema>;
export type FormType = CreateScheduleSchemaType | UpdateScheduleSchemaType;


