import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import InputField from "../Shared/InputField";
import Button from "../Shared/Button";
import { useUpdateProfile, type Profile } from "../../hooks/User/useProfile ";
import type { UserProfileFormValues } from "../../types/user/types";
import { userProfileSchema } from "../../schema/user/user.schems";

type Props = {
  profile: Profile | undefined;
  closeSheet: () => void;
};

export default function UserProfileForm({ profile, closeSheet }: Props) {
  const updateMutation = useUpdateProfile();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid, isDirty, dirtyFields },
  } = useForm<UserProfileFormValues>({
    resolver: yupResolver(userProfileSchema),
    mode: "onChange",
    values: {
      name: profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      city: profile?.city ?? "",
    },
  });

  const onSubmit = (data: UserProfileFormValues) => {
    const updatedData = Object.fromEntries(
      Object.entries(data).filter(([key]) =>
        Object.keys(dirtyFields).includes(key),
      ),
    );

    updateMutation.mutate(updatedData, {
      onSuccess: () => {
        closeSheet();
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
          placeholder="Enter name"
          registration={register("name")}
          error={errors.name}
          inputClassName="!py-2 !px-3 text-sm"
        />

        <InputField
          label="Email"
          placeholder="Enter email"
          registration={register("email")}
          error={errors.email}
          inputClassName="!py-2 !px-3 text-sm"
        />

        <InputField
          label="Phone"
          placeholder="Enter phone"
          registration={register("phone")}
          error={errors.phone}
          inputClassName="!py-2 !px-3 text-sm"
        />

        <InputField
          label="City"
          placeholder="Enter city"
          registration={register("city")}
          error={errors.city}
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
