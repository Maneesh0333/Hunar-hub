import * as yup from "yup";

export const portfolioSchema = yup
  .object({
    image1: yup.string().optional(),
    image2: yup.string().optional(),
    image3: yup.string().optional(),
    image4: yup.string().optional(),
  })
  .noUnknown(true, "Unknown fields are not allowed");
