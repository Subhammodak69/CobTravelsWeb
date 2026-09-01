import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

function normalizeOption(option) {
  if (typeof option === "string") {
    return { label: option, value: option };
  }

  return {
    label: option?.label ?? option?.name ?? option?.value ?? "",
    value: option?.value ?? option?.id ?? option?.name ?? "",
  };
}

export default function CustomSelect({
  value,
  options = [],
  onChange,
  placeholder = "Select an option",
  className = "",
  triggerClassName = "",
  menuClassName = "",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const normalizedOptions = options.map(normalizeOption);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selectedOption = normalizedOptions.find(
    (option) => String(option.value) === String(value)
  );

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((current) => !current)}
        className={`flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-xs sm:text-sm font-medium text-slate-800 transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 ${triggerClassName}`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180 text-primary" : ""}`}
        />
      </button>

      {open && (
        <div
          className={`absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-elevated animate-slide-down ${menuClassName}`}
        >
          {normalizedOptions.map((option, index) => {
            const isSelected = String(option.value) === String(value);

            return (
              <button
                key={`${option.value}-${index}`}
                type="button"
                onClick={() => {
                  onChange?.(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs sm:text-sm font-medium transition ${
                  isSelected
                    ? "bg-primary-50 text-primary font-bold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-primary"
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
