import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "../Shared/Button";
import {
  useCreateUpdatePortfolio,
  type Portfolio,
} from "../../hooks/Entrepreneur/useCreatePortfolio";
import type { PortfolioFormValues } from "../../types/entrepreneur/types";
import { schema } from "../../schema/entrepreneur/portfolio.schema";

type Props = {
  closeSheet: () => void;
  images: Portfolio | undefined;
};

export default function PortfolioForm({ closeSheet, images }: Props) {
  const createPortfolioMutation = useCreateUpdatePortfolio();

  const {
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { isValid, isDirty, dirtyFields },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    values: {
      image1: images?.image1 || undefined,
      image2: images?.image2 || undefined,
      image3: images?.image3 || undefined,
      image4: images?.image4 || undefined,
    },
  });

  const values = useWatch({ control });

  const onSubmit = (data: PortfolioFormValues) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, image]) => {
      if (Object.keys(dirtyFields).includes(key)) {
        formData.append(key, image);
      }
    });

    createPortfolioMutation.mutate(formData, {
      onSuccess: () => {
        closeSheet();
        reset();
      },
    });
  };

  const removeImage = (field: keyof PortfolioFormValues) => {
    setValue(field, undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const imageFields: (keyof PortfolioFormValues)[] = [
    "image1",
    "image2",
    "image3",
    "image4",
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative flex h-full flex-col gap-6"
    >
      <div
        className="grid grid-cols-1 gap-4 overflow-y-auto pb-16"
        style={{ scrollbarWidth: "none" }}
      >
        {imageFields.map((field) => {
          const image = values[field];

          return (
            <div key={field}>
              {image ? (
                <div className="relative rounded-2xl overflow-hidden border border-[rgba(196,99,42,0.12)]">
                  <img
                    src={
                      typeof image === "string"
                        ? image
                        : URL.createObjectURL(image)
                    }
                    alt="preview"
                    className="w-full h-32 object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(field)}
                    className="absolute top-2 right-2 bg-black/70 cursor-pointer text-white text-xs px-2 py-1 rounded-md"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="mt-2 flex items-center justify-center w-full h-32 border-2 border-dashed border-[rgba(196,99,42,0.25)] rounded-2xl cursor-pointer hover:bg-[#FAF5ED] transition">
                  <div className="text-center">
                    <p className="text-sm font-medium text-[#2C1A0E]">
                      Click to upload
                    </p>

                    <p className="text-xs text-[#6B4A2D] mt-1">
                      PNG, JPG, WEBP, AVIF
                    </p>
                  </div>

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.avif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (!file) return;

                      setValue(field, file, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                  />
                </label>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-white absolute bottom-0 w-full rounded-t-xl">
        <Button
          type="submit"
          label="Save Portfolio"
          className="w-full"
          disabled={!isValid || !isDirty || createPortfolioMutation.isPending}
          isLoading={createPortfolioMutation.isPending}
        />
      </div>
    </form>
  );
}
