import * as yup from "yup";

export const schema = yup.object({
  image1: yup.mixed<File | string>().optional(),
  image2: yup.mixed<File | string>().optional(),
  image3: yup.mixed<File | string>().optional(),
  image4: yup.mixed<File | string>().optional(),
});
