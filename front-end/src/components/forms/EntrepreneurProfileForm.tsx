import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";

import InputField from "../Shared/InputField";
import Button from "../Shared/Button";

import {
  useUpdateProfile,
  type EntrepreneurProfile,
} from "../../hooks/Entrepreneur/useProfile";

import * as yup from "yup";
import SelectInput from "../Shared/SelectInput";
import { useAllCategories } from "../../hooks/Admin/useCategories";

export const profileSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name cannot exceed 30 characters"),

  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Invalid email"),

  phone: yup
    .string()
    .trim()
    .required("Phone is required")
    .matches(/^[0-9]{10,15}$/, "Invalid phone number"),

  bio: yup
    .string()
    .trim()
    .max(30, "Bio must be at most 30 characters")
    .notRequired()
    .default(""),

  about: yup
    .string()
    .trim()
    .max(300, "About must be at most 300 characters")
    .notRequired()
    .default(""),

  city: yup
    .string()
    .trim()
    .max(30, "City is too long")
    .notRequired()
    .default(""),

  visitType: yup
    .array()
    .of(yup.string().oneOf(["visit_home", "visit_workshop"]))
    .max(2, "Max 2 visit type methods allowed")
    .notRequired()
    .default([]),

  skills: yup
    .string()
    .trim()
    .test("skills-validation", function (value) {
      if (!value) return true;

      const arr = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase());

      // Max limit
      if (arr.length > 20) {
        return this.createError({
          message: "You can add a maximum of 20 skills",
        });
      }

      // Duplicate check
      if (new Set(arr).size !== arr.length) {
        return this.createError({
          message: "Duplicate skills are not allowed",
        });
      }

      // Length validation
      const invalid = arr.find((s) => s.length < 2 || s.length > 30);
      if (invalid) {
        return this.createError({
          message: `Each skill must be between 2 and 30 characters (invalid: "${invalid}")`,
        });
      }

      return true;
    })
    .notRequired()
    .default(""),

  languages: yup
    .string()
    .trim()
    .test("languages-validation", function (value) {
      if (!value) return true;

      const arr = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase());

      // Max limit
      if (arr.length > 10) {
        return this.createError({
          message: "You can add a maximum of 10 languages",
        });
      }

      // Duplicate check
      if (new Set(arr).size !== arr.length) {
        return this.createError({
          message: "Duplicate skills are not allowed",
        });
      }

      // Length validation
      const invalid = arr.find((s) => s.length < 2 || s.length > 30);
      if (invalid) {
        return this.createError({
          message: `Each language must be between 2 and 30 characters (invalid: "${invalid}")`,
        });
      }

      return true;
    })
    .notRequired()
    .default(""),

  payment: yup
    .array()
    .of(yup.string().oneOf(["Cash", "UPI"]))
    .max(2, "Max 2 payment methods allowed")
    .notRequired()
    .default([]),

  category: yup.string().trim().notRequired().default(""),

  experienceYears: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .min(0, "Experience cannot be negative")
    .max(60, "Invalid experience value")
    .notRequired()
    .default(0),
});

export type ProfileFormValues = yup.InferType<typeof profileSchema>;

type Props = {
  profile: EntrepreneurProfile | undefined;
  closeSheet: () => void;
};

export default function EntrepreneurProfileForm({
  profile,
  closeSheet,
}: Props) {
  const updateMutation = useUpdateProfile();
  const { data, isLoading } = useAllCategories();

  const categories = data ?? [];

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors, isValid, isDirty, dirtyFields },
  } = useForm<ProfileFormValues>({
    resolver: yupResolver(profileSchema),
    mode: "onChange",
  });

  useEffect(() => {
    reset({
      name: profile?.user.name,
      email: profile?.user.email,
      phone: profile?.user.phone,
      bio: profile?.bio ?? "",
      about: profile?.about ?? "",
      city: profile?.city ?? "",
      category: profile?.category?._id ?? "",
      languages: profile?.languages.toString() ?? "",
      experienceYears: profile?.experienceYears ?? 0,
      skills: profile?.skills.toString() ?? "",
      payment: profile?.payment ?? [],
      visitType: profile?.visitType ?? [],
    });
  }, [profile, reset]);

  const onSubmit = (data: ProfileFormValues) => {
    let updatedSkills: string[] = [];
    if (data.skills && data.skills?.length > 0) {
      updatedSkills = data.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    let updatedLanguage: string[] = [];
    if (data.languages && data.languages?.length > 0) {
      updatedLanguage = data.languages
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }


    const updatedData: Partial<ProfileFormValues> = Object.fromEntries(
      Object.entries(data)
        .filter(([key]) => Object.keys(dirtyFields).includes(key))
        .filter(([key]) => key !== "skills" && key !== "languages"),
    );
    
    updateMutation.mutate(
      {
        ...updatedData,
        ...(dirtyFields.skills ? { skills: updatedSkills } : {}),
        ...(dirtyFields.languages ? { languages: updatedLanguage } : {}),
      },
      {
        onSuccess: () => {
          closeSheet();
          reset();
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative flex flex-col h-full justify-between"
    >
      <div
        className="flex flex-col gap-3 pb-6 overflow-y-scroll"
        style={{ scrollbarWidth: "none" }}
      >
        <InputField
          label="Name"
          name="name"
          placeholder="Enter name"
          register={register}
          errors={errors}
          inputClassName="!py-2 !px-3 text-sm"
        />

        <InputField
          label="Email"
          name="email"
          placeholder="Enter email"
          register={register}
          errors={errors}
          inputClassName="!py-2 !px-3 text-sm"
        />

        <InputField
          label="Phone"
          name="phone"
          placeholder="Enter phone"
          register={register}
          errors={errors}
          inputClassName="!py-2 !px-3 text-sm"
        />

        <Controller
          name="category"
          control={control}
          render={({ field, fieldState }) => (
            <SelectInput
              label="Category"
              value={field.value ?? ""}
              onChange={(val) => field.onChange(val || undefined)}
              options={categories.map((cat) => ({
                label: cat.name,
                value: cat._id,
              }))}
              error={fieldState.error?.message}
              isLoading={isLoading}
            />
          )}
        />

        <Controller
          name="payment"
          control={control}
          render={({ field, fieldState }) => (
            <SelectInput
              label="Payment Methods"
              value={(field.value ?? []).filter((v): v is string => Boolean(v))}
              onChange={field.onChange}
              options={[
                { label: "Cash", value: "Cash" },
                { label: "UPI", value: "UPI" },
              ]}
              error={fieldState.error?.message}
              multiple
            />
          )}
        />

        <Controller
          name="visitType"
          control={control}
          render={({ field, fieldState }) => (
            <SelectInput
              label="Visit Type"
              value={(field.value ?? []).filter((v): v is string => Boolean(v))}
              onChange={field.onChange}
              options={[
                { label: "Home Visit", value: "visit_home" },
                { label: "Workshop Visit", value: "visit_workshop" },
              ]}
              error={fieldState.error?.message}
              multiple
            />
          )}
        />

        <InputField
          label="Bio"
          name="bio"
          placeholder="Short bio"
          register={register}
          errors={errors}
          inputClassName="!py-2 !px-3 text-sm"
        />

        <InputField
          label="About"
          name="about"
          placeholder="About you"
          register={register}
          errors={errors}
          inputClassName="!py-2 !px-3 text-sm"
        />

        <InputField
          label="Skills (comma separated)"
          name="skills"
          placeholder="e.g Tailoring, Stitching (max 20 skills)"
          register={register}
          errors={errors}
          inputClassName="!py-2 !px-3 text-sm"
        />

        <InputField
          label="Languages (comma separated)"
          name="languages"
          placeholder="e.g English, Hindi (max 10 languages)"
          register={register}
          errors={errors}
          inputClassName="!py-2 !px-3 text-sm"
        />

        <InputField
          label="City"
          name="city"
          placeholder="Enter city"
          register={register}
          errors={errors}
          inputClassName="!py-2 !px-3 text-sm"
        />

        <InputField
          label="Experience Years"
          name="experienceYears"
          type="number"
          placeholder="Years of experience"
          register={register}
          errors={errors}
          inputClassName="!py-2 !px-3 text-sm"
        />
      </div>

      <Button
        type="submit"
        label="Update Profile"
        className="absolute bottom-0 w-full"
        disabled={!isValid || !isDirty || updateMutation.isPending}
        isLoading={updateMutation.isPending}
      />
    </form>
  );
}
