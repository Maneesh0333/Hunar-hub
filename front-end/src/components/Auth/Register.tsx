import { useState } from "react";
import InputField from "../Shared/InputField";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Header from "./Header";

import Button from "./Button";
import type { Step } from "./Stepper";
import { useMutation } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";

const registerSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name is too long"),

  email: yup
    .string()
    .trim()
    .email("Invalid email format")
    .required("Email is required")
    .lowercase()
    .transform((value) => value.toLowerCase()),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Za-z]/, "Password must contain at least one letter")
    .matches(/[0-9]/, "Password must contain at least one number"),

  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{10,15}$/, "Invalid phone number"),

  signupAs: yup
    .string()
    .oneOf(["User", "Entrepreneur"], "Invalid role")
    .required("Role is required"),
});

type RegisterFormType = yup.InferType<typeof registerSchema>;

type RegisterProps = {
  setCurrentStep: (step: Step) => void;
  setEmail: (email: string)=>void;
};


interface RegisterResponse {
  success: true;
  message: string;
}

function Register({ setCurrentStep, setEmail }: RegisterProps) {
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<RegisterFormType>({
    resolver: yupResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      signupAs: "User",
    },
  });

  const signupAs = watch("signupAs");

  const resiterMutation = useMutation<RegisterResponse, any, RegisterFormType>({
    mutationFn: async (formData) => {
      const res = await axiosApi.post("/auth/register", formData);
      return res.data;
    },
    onSuccess: (data, variables) => {
      // 2xx success response
      if (data.success) {
        alert(data.message);
        setCurrentStep("Verify");
        setEmail(variables.email)
      }
    },
    onError: (error: any) => {
      // Network error
      if (!error.response) {
        alert("Network error, please try again later.");
        return;
      }

      const {  data } = error.response as {
        status: number;
        data: RegisterResponse;
      };

      alert(data.message || "Login failed");
    },
  });

  const onSubmit = (formData: RegisterFormType) => {
    resiterMutation.mutate(formData);
  };

  return (
    <div>
      {/* Title */}
      <Header
        title="Join HunarHub"
        description="Create your account and discover local artisans in minutes."
      />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name */}
        <InputField
          name="name"
          label="NAME"
          placeholder="Your Name"
          register={register}
          errors={errors}
        />

        {/* Phone */}
        <InputField
          name="phone"
          label="MOBILE NUMBER"
          placeholder="98765 43210"
          register={register}
          errors={errors}
        />

        {/* Email */}
        <InputField
          name="email"
          label="EMAIL"
          placeholder="email@example.com"
          register={register}
          errors={errors}
        />

        {/* Password */}
        <InputField
          name="password"
          label="PASSWORD"
          placeholder="Enter your password"
          type="password"
          register={register}
          errors={errors}
        />

        {/* Role */}
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

        {/* agree */}
        <div className="mt-8 text-xs text-[var(--earth)]">
          By continuing, you agree to HunarHub’s{" "}
          <span className="text-[var(--clay)] font-semibold">Terms</span> &{" "}
          <span className="text-[var(--clay)] font-semibold">
            Privacy Policy
          </span>
        </div>

        {/* Submit */}
        <Button type="submit" isValid={isValid} label="Create Account →" isLoading={resiterMutation.isPending} />
      </form>
    </div>
  );
}

export default Register;
