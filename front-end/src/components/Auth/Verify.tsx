import OTPInput from "../OTPInput";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "./Button";
import type { Step } from "./Stepper";
import { useMutation } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";
import toast from "react-hot-toast";

type VerifyProps = {
  setCurrentStep?: (step: Step) => void;
  email: string;
};

const verifyOtpSchema = yup.object({
  otp: yup
    .string()
    .required("OTP is required")
    .length(6, "OTP must be exactly 6 digits")
    .matches(/^\d+$/, "OTP must contain only numbers"),
});

type VerifyFormType = yup.InferType<typeof verifyOtpSchema>;

interface VerifyResponse {
  success: true;
  message: string;
}

function Verify({ setCurrentStep, email }: VerifyProps) {
  const {
    handleSubmit,
    setValue,
    formState: { isValid, errors },
  } = useForm<VerifyFormType>({
    resolver: yupResolver(verifyOtpSchema),
    mode: "onChange",
    defaultValues: { otp: "" },
  });

  const verifyMutation = useMutation<VerifyResponse, any, VerifyFormType>({
    mutationFn: async (formData) => {
      const res = await axiosApi.post("/auth/verify", { ...formData, email });
      return res.data;
    },
    onSuccess: (data) => {
      // 2xx success response
      if (data.success) {
        toast.success(data.message);
        {
          setCurrentStep && setCurrentStep("Done");
        }
      }
    },
    onError: (error: any) => {
      // Network error
      if (!error.response) {
        toast.success("Network error, please try again later.");
        return;
      }

      const { data } = error.response as {
        status: number;
        data: VerifyResponse;
      };

      toast.success(data.message || "Login failed");
    },
  });

  const onSubmit = (formData: VerifyFormType) => {
    verifyMutation.mutate(formData);
  };

  return (
    <div>
      <div className="mb-5">
        <h3 className="font-playfair text-3xl font-black mb-2">
          Verify your Email
        </h3>
        <p className="text-sm text-[var(--earth-mid)]">
          We sent a 6-digit code to the registered email.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <OTPInput
          onChange={(otp) => setValue("otp", otp, { shouldValidate: true })}
        />

        {errors.otp && (
          <p className="text-sm text-red-600 text-center mt-2">
            {errors.otp.message}
          </p>
        )}

        <div className="mt-6">
          <Button type="submit" isValid={isValid} label="Verify" isLoading={verifyMutation.isPending} />
        </div>
      </form>
    </div>
  );
}

export default Verify;
