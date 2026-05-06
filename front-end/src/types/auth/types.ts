import type {
  loginSchema,
  registerSchema,
  verifyOtpSchema,
} from "../../schema/auth/auth.schema";
import * as yup from "yup";

export type VerifyFormType = yup.InferType<typeof verifyOtpSchema>;

export type LoginFormType = yup.InferType<typeof loginSchema>;

export type RegisterFormType = yup.InferType<typeof registerSchema>;
