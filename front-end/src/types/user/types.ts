import * as yup from "yup";
import type { bookingSchema } from "../../schema/user/booking.schema";
import type { complaintSchema } from "../../schema/user/complaint.schema";
import type { reviewSchema } from "../../schema/user/review.schema";
import type { userProfileSchema } from "../../schema/user/user.schems";

export type bookingSchemaType = yup.InferType<typeof bookingSchema>;
export type ComplaintFormType = yup.InferType<typeof complaintSchema>;
export type ReviewFormType = yup.InferType<typeof reviewSchema>;
export type UserProfileFormValues = yup.InferType<typeof userProfileSchema>;

