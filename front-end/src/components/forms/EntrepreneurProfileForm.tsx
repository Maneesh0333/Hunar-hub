import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";

import InputField from "../Shared/InputField";
import Button from "../Shared/Button";

import {
  useUpdateProfile,
  type EntrepreneurProfile,
  type UpdateProfilePayload,
} from "../../hooks/Entrepreneur/useProfile";
import SelectInput from "../Shared/SelectInput";
import { useAllCategories } from "../../hooks/Admin/useCategories";
import type { ProfileFormValues } from "../../types/entrepreneur/types";
import { profileSchema } from "../../schema/entrepreneur/entrepreneurProfile.schema";


type BaseProfilePayload = Partial<
  Omit<ProfileFormValues, "skills" | "languages">
>;

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
      city: profile?.user.city ?? "",
      category: profile?.category?._id ?? "",
      languages: profile?.languages.toString() ?? "",
      experienceYears: profile?.experienceYears ?? 0,
      skills: profile?.skills.toString() ?? "",
      payment: profile?.payment ?? [],
      visitType: profile?.visitType ?? [],
    });
  }, [profile, reset]);

  const onSubmit = (data: ProfileFormValues) => {
    const dirtyKeys = new Set(Object.keys(dirtyFields));

    // 👇 build base object (WITHOUT skills & languages)
    const updatedData = Object.fromEntries(
      Object.entries(data).filter(
        ([key]) =>
          dirtyKeys.has(key) && key !== "skills" && key !== "languages",
      ),
    ) as BaseProfilePayload;

    // 👇 build final payload
    const payload: UpdateProfilePayload = {
      ...updatedData,

      ...(dirtyFields.skills && data.skills
        ? {
            skills: data.skills
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean),
          }
        : {}),

      ...(dirtyFields.languages && data.languages
        ? {
            languages: data.languages
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          }
        : {}),
    };

    updateMutation.mutate(payload, {
      onSuccess: () => {
        closeSheet();
        reset();
      },
    });
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
