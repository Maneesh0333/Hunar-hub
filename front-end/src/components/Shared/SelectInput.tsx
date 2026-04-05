import { useState } from "react";

type Option = {
  label: string;
  value: string;
};

type SelectInputProps = {
  label: string;
  options: Option[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  error?: string;
  placeholder?: string;
  isLoading?: boolean;
  multiple?: boolean;
};

function SelectInput({
  label,
  options,
  value,
  onChange,
  error,
  placeholder = "Select an option",
  isLoading = false,
  multiple = false,
}: SelectInputProps) {
  const [open, setOpen] = useState(false);

  // Normalize value
  const selectedValues = multiple
    ? (value as string[]) || []
    : value
    ? [value as string]
    : [];

  const toggleSelect = (option: Option) => {
    if (multiple) {
      if (selectedValues.includes(option.value)) {
        onChange(selectedValues.filter((v) => v !== option.value));
      } else {
        onChange([...selectedValues, option.value]);
      }
    } else {
      onChange(option.value);
      setOpen(false);
    }
  };

  const selectedLabels = options
    .filter((o) => selectedValues.includes(o.value))
    .map((o) => o.label);

  return (
    <div className="relative">
      <label className="text-xs font-semibold tracking-wide text-[var(--clay)]">
        {label}
      </label>

      {/* Trigger */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="mt-2 w-full px-3 py-2 text-sm rounded-xl border border-[var(--border-1)] cursor-pointer bg-white flex justify-between items-center"
      >
        <div className="flex flex-wrap gap-1">
          {selectedLabels.length > 0 ? (
            multiple ? (
              selectedLabels.map((label) => (
                <span
                  key={label}
                  className="bg-gray-200 px-2 py-1 rounded text-xs"
                >
                  {label}
                </span>
              ))
            ) : (
              <span>{selectedLabels[0]}</span>
            )
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <span>▼</span>
      </div>

      {/* Dropdown */}
      {open && (
        <>
          {!isLoading ? (
            <ul className="absolute z-10 w-full bg-white border border-[var(--border-1)] rounded-xl mt-1 shadow-lg max-h-40 overflow-y-auto">
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);

                return (
                  <li
                    key={option.value}
                    onClick={() => toggleSelect(option)}
                    className={`px-3 py-2 cursor-pointer flex justify-between ${
                      isSelected ? "bg-gray-100" : "hover:bg-gray-100"
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && <span>✓</span>}
                  </li>
                );
              })}
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