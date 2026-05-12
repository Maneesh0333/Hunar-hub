import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import Header from "./Header";
import InputField from "../Shared/InputField";
import Button from "./Button";
import Verify from "./Verify";
import { useLogin } from "../../hooks/Auth/useLogin";
import { loginSchema } from "../../schema/auth/auth.schema";
import type { LoginFormType } from "../../types/auth/types";

type PageType = "Login" | "Verify";

function Login() {
  const [page, setPage] = useState<PageType>("Login");
  const [email, setEmail] = useState("");

  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = useForm<LoginFormType>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const loginMutation = useLogin();

  const onSubmit = (formData: LoginFormType) => {
    loginMutation.mutate(formData, {
      onError: (error, data) => {
        if (
          error.response &&
          error.response.data?.code === "EMAIL_NOT_VERIFIED"
        ) {
          setPage("Verify");
          setEmail(data.email);
        }
      },
    });
  };

  return (
    <>
      {page === "Login" ? (
        <div>
          {/* Title */}
          <Header
            title="Welcome back"
            description="Sign in to access your orders, messages and saved artisans."
          />

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <InputField
              label="EMAIL"
              placeholder="email@example.com"
              registration={register("email")}
              error={errors.email}
            />

            {/* Password */}
            <InputField
              label="PASSWORD"
              type="password"
              placeholder="Enter your password"
              registration={register("password")}
              error={errors.password}
            >
              {/* <div className="text-right mt-2">
                <span className="text-xs text-[var(--clay)] cursor-pointer hover:underline">
                  Forgot password?
                </span>
              </div> */}
            </InputField>

            {/* Submit */}
            <div className="mt-10">
              <Button
                type="submit"
                isValid={isValid}
                label="Sign In"
                isLoading={loginMutation.isPending}
              />
            </div>
          </form>
        </div>
      ) : (
        <Verify setPage={setPage} goto="Login" email={email} />
      )}
    </>
  );
}

export default Login;
