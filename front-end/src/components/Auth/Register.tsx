import InputField from "../Shared/InputField";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Header from "./Header";

import Button from "./Button";
import type { Step } from "./Stepper";

import { useRegister } from "../../hooks/Auth/useRegister";
import type { RegisterFormType } from "../../types/auth/types";
import { registerSchema } from "../../schema/auth/auth.schema";

type RegisterProps = {
  setCurrentStep: (step: Step) => void;
  setEmail: (email: string) => void;
  role: "User" | "Entrepreneur";
};

function Register({ setCurrentStep, setEmail, role }: RegisterProps) {
  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm<RegisterFormType>({
    resolver: yupResolver(registerSchema),
    mode: "onChange",
    values: {
      signupAs: role,
      email: "",
      name: "",
      password: "",
      phone: "",
    },
  });

  const signupAs = useWatch({
    control,
    name: "signupAs",
  });

  const resiterMutation = useRegister();

  const onSubmit = (formData: RegisterFormType) => {
    resiterMutation.mutate(formData, {
      onSuccess: (data, variables) => {
        if (data.success) {
          setCurrentStep("Verify");
          setEmail(variables.email);
        }
      },
    });
  };

  return (
    <>
      <Header
        title="Join HunarHub"
        description="Create your account and discover local artisans in minutes."
      />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name */}
        <InputField
          label="NAME"
          placeholder="Your Name"
          registration={register("name")}
          error={errors.name}
        />

        {/* Phone */}
        <InputField
          label="MOBILE NUMBER"
          placeholder="98765 43210"
          registration={register("phone")}
          error={errors.phone}
        />

        {/* Email */}
        <InputField
          label="EMAIL"
          placeholder="email@example.com"
          registration={register("email")}
          error={errors.email}
        />

        {/* Password */}
        <InputField
          label="PASSWORD"
          placeholder="Enter your password"
          type="password"
          registration={register("password")}
          error={errors.password}
        />

        {/* Role */}
        <Controller
          name="signupAs"
          control={control}
          render={() => (
            <div>
              <label className="text-xs font-semibold tracking-wide text-[var(--clay)]">
                I AM SIGNING UP AS
              </label>
              <div className="grid grid-cols-2 mt-2 gap-3">
                <div
                  onClick={() => setValue("signupAs", "User")}
                  className={`${signupAs === "User" ? "bg-[var(--cream)] border-[var(--clay)] text-[var(--clay)]" : "bg-white border-[rgba(196,99,42,0.2)] text-[var(--earth-mid)]"} flex flex-col items-center px-5 py-3 border rounded-2xl cursor-pointer`}
                >
                  <span className="text-[22px]">🛍️</span>
                  <h1 className="text-xs font-semibold mt-1">Customer</h1>
                  <p className="text-[10px] text-[var(--earth-mid)]">
                    Book artisans
                  </p>
                </div>

                <div
                  onClick={() => setValue("signupAs", "Entrepreneur")}
                  className={`${signupAs === "Entrepreneur" ? "bg-[var(--cream)] border-[var(--clay)] text-[var(--clay)]" : "bg-white border-[rgba(196,99,42,0.2)] text-[var(--earth-mid)]"} flex flex-col items-center px-5 py-3 border rounded-2xl cursor-pointer`}
                >
                  <span className="text-[22px]">🧵</span>
                  <h1 className="text-xs font-semibold mt-1">Artisan</h1>
                  <p className="text-[10px] text-[var(--earth-mid)]">
                    Offer services
                  </p>
                </div>
              </div>
            </div>
          )}
        />

        {/* agree */}
        <div className="mt-8 text-xs text-[var(--earth)]">
          By continuing, you agree to HunarHub’s{" "}
          <span className="text-[var(--clay)] font-semibold">Terms</span> &{" "}
          <span className="text-[var(--clay)] font-semibold">
            Privacy Policy
          </span>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          isValid={isValid}
          label="Create Account →"
          isLoading={resiterMutation.isPending}
        />
      </form>
    </>
  );
}

export default Register;
