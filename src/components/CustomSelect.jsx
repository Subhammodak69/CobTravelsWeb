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
      <style>{`
        @keyframes custom-select-fade {
          0% {
            opacity: 0;
            transform: translateY(-8px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((current) => !current)}
        className={`flex w-full items-center justify-between rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-left text-sm text-white shadow-inner shadow-white/5 transition hover:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/50 disabled:cursor-not-allowed disabled:opacity-60 ${triggerClassName}`}
      >
        <span className="truncate font-medium">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-white/60 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className={`absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl shadow-black/30 backdrop-blur-md ${menuClassName}`}
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
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  isSelected
                    ? "bg-amber-300 text-slate-950"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
                style={{
                  animation: "custom-select-fade 0.2s ease forwards",
                  animationDelay: `${index * 45}ms`,
                  opacity: 0,
                }}
              >
                <span>{option.label}</span>
                {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-slate-950" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
