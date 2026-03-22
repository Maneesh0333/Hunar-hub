import { useEffect, useRef, useState } from "react";

type OTPInputProps = {
  length?: number;
  onChange?: (otp: string) => void;
  onComplete?: (otp: string) => void;
};

export default function OTPInput({
  length = 6,
  onChange,
  onComplete,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const updateOtp = (newOtp: string[]) => {
    setOtp(newOtp);
    const joined = newOtp.join("");
    onChange?.(joined);

    if (joined.length === length && !newOtp.includes("")) {
      onComplete?.(joined);
    }
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    updateOtp(newOtp);

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, length);

    if (!/^\d+$/.test(pasted)) return;

    updateOtp([...pasted.split(""), ...Array(length - pasted.length).fill("")]);

    inputsRef.current[Math.min(pasted.length - 1, length - 1)]?.focus();
  };

  return (
    <div
      className="flex gap-2 justify-center"
      role="group"
      aria-label="One-time password"
    >
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="
            w-12 h-14
            text-center text-lg font-semibold
            rounded-xl
            border border-[rgba(196,99,42,0.25)]
            focus:outline-none focus:border-[var(--clay)]
            bg-white
          "
        />
      ))}
    </div>
  );
}
