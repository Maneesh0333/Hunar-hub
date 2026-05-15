import OTPInput from "../OTPInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "./Button";
import type { Step } from "./Stepper";

import { useVerifyOtp } from "../../hooks/Auth/useVerifyOtp";
import type { VerifyFormType } from "../../types/auth/types";
import { verifyOtpSchema } from "../../schema/auth/auth.schema";

type VerifyProps = {
  setCurrentStep?: (step: Step) => void;
  email: string;
  setPage?: (page: "Login") => void;
  goto?: "Login" | undefined;
};

function Verify({ setCurrentStep, email, goto, setPage }: VerifyProps) {
  const {
    handleSubmit,
    setValue,
    formState: { isValid, errors },
  } = useForm<VerifyFormType>({
    resolver: yupResolver(verifyOtpSchema),
    mode: "onChange",
    defaultValues: { otp: "" },
  });

  const verifyMutation = useVerifyOtp();

  const onSubmit = (formData: VerifyFormType) => {
    verifyMutation.mutate(
      { ...formData, email },
      {
        onSuccess: (data) => {
          if (data.success) {
            if (goto === "Login") {
              setTimeout(() => {
                if (setPage) {
                  setPage("Login");
                }
              }, 1000);
            } else {
              if (setCurrentStep) {
                setCurrentStep("Done");
              }
            }
          }
        },
      },
    );
  };

  return (
    <>
      <div className="mb-5">
        <h3 className="font-playfair text-3xl font-black mb-2">
          Verify your Email
        </h3>
        <p className="text-sm text-[var(--earth-mid)]">
          We sent a 6-digit code to the registered email. <span className="font-bold">For now use 000000 as your OTP</span>
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
          <Button
            type="submit"
            isValid={isValid}
            label="Verify"
            isLoading={verifyMutation.isPending}
          />
        </div>
      </form>
    </>
  );
}

export default Verify;
