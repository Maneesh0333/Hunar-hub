import { useState } from "react";

type Option = {
  label: string;
  value: string;
};

type SelectInputProps = {
  label: string;
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  isLoading?: boolean;
};

function SelectInput({
  label,
  options,
  value,
  onChange,
  error,
  placeholder = "Select an option",
  isLoading = false,
}: SelectInputProps) {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setOpen(false);
  };

  return (
    <div className="relative">
      <label className="text-xs font-semibold tracking-wide text-[var(--clay)]">
        {label}
      </label>

      <div
        onClick={() => setOpen(!open)}
        className="mt-2 w-full px-3 py-2 text-sm rounded-xl border border-[var(--border-1)] cursor-pointer bg-white flex justify-between"
      >
        <span>{selected ? selected.label : placeholder}</span>
        <span>▼</span>
      </div>

      {open && (
        <>
          {!isLoading ? (
            <ul className="absolute z-10 w-full bg-white border border-[var(--border-1)] rounded-xl mt-1 shadow-lg max-h-30 overflow-y-auto">
              {options.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {option.label}
                </li>
              ))}
            </ul>
          ) : (
            <div className="absolute z-10 w-full flex items-center justify-center bg-white border border-[var(--border-1)] rounded-xl mt-1 px-3 py-2 h-15 shadow-lg">
              <span className="flex h-5 w-5 border-2 border-gray-300 rounded-full border-t-2 border-t-black animate-spin" />
            </div>
          )}
        </>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default SelectInput;
