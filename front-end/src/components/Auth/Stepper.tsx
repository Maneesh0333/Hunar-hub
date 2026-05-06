export type Step = "Details" | "Verify" | "Done";

interface StepperProps {
  steps: Step[];
  currentStep: Step;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  const currentIndex = steps.indexOf(currentStep);

  const progressWidth =
    currentStep === "Details"
      ? "0%"
      : currentStep === "Verify"
        ? "50%"
        : "100%";

  return (
    <div className="relative grid grid-cols-3 text-xs text-[#6B4A2D]">
      {/* Progress bar */}
      <div className="absolute top-3.5 w-full px-8">
        <div className="relative">
          <div
            className="absolute top-0 left-0 h-1 bg-green-600 z-10 transition-all duration-500"
            style={{ width: progressWidth }}
          />
          <div className="absolute top-0 left-0 h-1 bg-[var(--khaki)] w-full" />
        </div>
      </div>

      {steps.map((step, index) => {
        const alignment =
          index === 0
            ? "items-start"
            : index === 1
              ? "items-center"
              : "items-end";

        const stepStyles =
          currentStep === "Done"
            ? "bg-green-600 text-[var(--warm-white)]"
            : index === currentIndex
              ? "bg-[var(--clay)] text-[var(--warm-white)]"
              : index > currentIndex
                ? "bg-[var(--warm-white)] text-[var(--earth)] border border-[rgba(196,99,42,0.15)]"
                : "bg-green-600 text-[var(--warm-white)]";

        return (
          <div key={step} className={`flex flex-col gap-2 ${alignment}`}>
            <span
              className={`${stepStyles} z-10 w-8 h-8 rounded-full flex font-semibold items-center justify-center`}
            >
              {index + 1}
            </span>
            <span>{step}</span>
          </div>
        );
      })}
    </div>
  );
}
