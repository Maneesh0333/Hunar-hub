import * as yup from "yup";
import type {
  CreateScheduleSchemaType,
  UpdateScheduleSchemaType,
} from "../../schema/entrepreneur/schedule.schema";
import type { profileSchema } from "../../schema/entrepreneur/entrepreneurProfile.schema";

export type ProfileFormValues = yup.InferType<typeof profileSchema>;
export type FormType = CreateScheduleSchemaType | UpdateScheduleSchemaType;

export type PortfolioFormValues = {
  image1?: string | undefined | File;
  image2?: string | undefined | File;
  image3?: string | undefined | File;
  image4?: string | undefined | File;
};
