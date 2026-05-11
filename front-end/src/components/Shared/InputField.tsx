import type {
  FieldError,
  UseFormRegisterReturn,
} from "react-hook-form";

type InputFieldProps = {
  label: string;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number" | "time";
  registration?: UseFormRegisterReturn;
  error?: FieldError;
  value?: string | number;
  children?: React.ReactNode;
  inputClassName?: string;
  readOnly?: boolean;
};

function InputField({
  label,
  placeholder,
  type = "text",
  registration,
  value,
  error,
  children,
  inputClassName = "",
  readOnly = false,
}: InputFieldProps) {
  return (
    <div>
      <label className="text-xs font-semibold tracking-wide text-[var(--clay)]">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value? value : undefined}
        readOnly={readOnly}
        {...registration}
        className={`mt-2 w-full px-4 py-3 rounded-xl
        border border-[rgba(196,99,42,0.2)]
        focus:outline-none focus:border-[var(--clay)]
        bg-white ${inputClassName}`}
      />

      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error.message}
        </p>
      )}

      {children}
    </div>
  );
}

export default InputField;