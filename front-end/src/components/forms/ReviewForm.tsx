import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useEffect, useState } from "react";

import InputField from "../Shared/InputField";
import Button from "../Shared/Button";
import { useCreateReview } from "../../hooks/User/useReviews";

/* ---------------- SCHEMA ---------------- */
export const reviewSchema = yup.object({
  rating: yup
    .number()
    .required("Please select a rating")
    .min(1, "Minimum 1 star")
    .max(5, "Maximum 5 stars"),

  comment: yup
    .string()
    .trim()
    .max(300, "Comment cannot exceed 300 characters")
    .optional()
    .default(""),
});

export type ReviewFormType = yup.InferType<typeof reviewSchema>;

type Props = {
  bookingId: string;
  closeSheet: () => void;
};

/* ---------------- COMPONENT ---------------- */
export default function ReviewForm({ bookingId, closeSheet }: Props) {
  const createReview = useCreateReview();
  const [hover, setHover] = useState(0);

  const {
    handleSubmit,
    setValue,
    register,
    watch,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ReviewFormType>({
    resolver: yupResolver(reviewSchema),
    mode: "onChange",
    defaultValues: {
      rating: undefined,
      comment: "",
    },
  });

  const rating = watch("rating");

  /* ---------------- RESET ---------------- */
  useEffect(() => {
    reset({
      rating: undefined,
      comment: "",
    });
  }, [reset]);

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = (data: ReviewFormType) => {

    console.log({
        bookingId,
        rating: data.rating,
        comment: data.comment,
      }, "_____")
    createReview.mutate(
      {
        bookingId,
        rating: data.rating,
        comment: data.comment,
      },
      {
        onSuccess: () => {
          reset();
          closeSheet();
        },
      },
    );
  };

  /* ---------------- UI ---------------- */
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full flex-col justify-between gap-6"
    >
      <div className="flex flex-col gap-5">
        {/* ⭐ Rating */}
        <div>
          <label className="text-xs font-semibold tracking-wide text-[var(--clay)]">
            Rate your experience
          </label>

          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() =>
                  setValue("rating", star, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className={`text-3xl md:text-2xl p-1 transition active:scale-110 ${
                  (hover || rating) >= star ? "text-amber-500" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          {rating && (
            <p className="text-xs text-[#6B4A2D] mt-1">
              You rated {rating} star{rating > 1 && "s"}
            </p>
          )}

          {errors.rating && (
            <p className="text-xs text-red-500 mt-1">{errors.rating.message}</p>
          )}
        </div>

        <div>
          <InputField
            label="Write a review (optional)"
            placeholder="Share your experience..."
            name="comment"
            errors={errors}
            inputClassName="!py-2 !px-3 text-sm"
            register={register}
          />
        </div>
      </div>

      {/* 🚀 Submit */}
      <Button
        type="submit"
        label="Submit Review"
        className="w-full"
        disabled={!isValid || createReview.isPending}
        isLoading={createReview.isPending}
      />
    </form>
  );
}
