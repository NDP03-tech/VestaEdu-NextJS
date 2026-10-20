import React from "react";

export const OptionItem = ({
  selected = false,
  isCorrect = false,
  isWrong = false,
  disabled = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  type = "radio",
  name,
  label,
  indexBadge,
  children,
  className = "",
}) => {
  // Compute states
  let borderClass = "border-slate-200 hover:border-slate-300 bg-white";
  let badgeClass = "bg-slate-100 text-slate-700 border-slate-300";

  if (isCorrect) {
    borderClass = "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20";
    badgeClass = "bg-emerald-600 text-white border-emerald-600";
  } else if (isWrong) {
    borderClass = "border-red-500 bg-red-50/60 ring-2 ring-red-500/20";
    badgeClass = "bg-red-600 text-white border-red-600";
  } else if (selected) {
    borderClass = "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20";
    badgeClass = "bg-blue-600 text-white border-blue-600";
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`group relative flex items-center justify-between rounded-xl border p-4 transition-all duration-200 ${borderClass} ${
        disabled ? "cursor-default opacity-85" : "cursor-pointer hover:shadow-sm"
      } ${className}`}
    >
      <div className="flex items-center gap-3.5 flex-1 pr-2">
        {/* Selector control (Radio / Checkbox) */}
        <div className="relative flex items-center justify-center">
          <input
            type={type}
            name={name}
            checked={selected}
            disabled={disabled}
            onChange={() => {}} // Controlled by wrapper click
            className={`h-5 w-5 border-slate-300 transition-colors ${
              type === "checkbox" ? "rounded" : "rounded-full"
            } ${
              isCorrect
                ? "text-emerald-600 focus:ring-emerald-500"
                : isWrong
                ? "text-red-600 focus:ring-red-500"
                : "text-blue-600 focus:ring-blue-500"
            }`}
          />
        </div>

        {/* Index letter badge (A, B, C, D) if provided */}
        {indexBadge && (
          <span
            className={`inline-flex h-6 w-6 items-center justify-center rounded-md border text-xs font-bold transition-colors ${badgeClass}`}
          >
            {indexBadge}
          </span>
        )}

        {/* Option text content */}
        <div className="text-sm font-medium text-slate-800 leading-relaxed flex-1">
          {label || children}
        </div>
      </div>

      {/* Status icon feedback */}
      {isCorrect && (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
      {isWrong && (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
      )}
    </div>
  );
};

