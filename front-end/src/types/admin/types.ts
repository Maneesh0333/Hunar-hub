import * as yup from "yup";
import type { CreateCategorySchemaType, UpdateCategorySchemaType } from "../../schema/admin/category.schema";
import type { createServiceSchema, updateServiceSchema } from "../../schema/admin/service.schema";

export type CategoryFormType = CreateCategorySchemaType | UpdateCategorySchemaType;
export type CreateServiceSchemaType = yup.InferType<typeof createServiceSchema>;
export type UpdateServiceSchemaType = yup.InferType<typeof updateServiceSchema>;

export type ServiceFormType = CreateServiceSchemaType | UpdateServiceSchemaType;
