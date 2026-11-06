import React from "react";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export const isFreePrice = (price) => !price || price === 0 || price === "0";

/* ------------------------------------------------------------------ */
/* Icons (stroke theo currentColor, đổi màu bằng text-*)               */
/* ------------------------------------------------------------------ */

const Svg = ({ size = 12, strokeWidth = 2, children }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const PlayIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export const UserIcon = (props) => (
  <Svg {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Svg>
);

export const BookIcon = (props) => (
  <Svg {...props}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </Svg>
);

export const ClockIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </Svg>
);

export const FileTextIcon = (props) => (
  <Svg {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </Svg>
);

export const ArrowRightIcon = ({ size = 13, strokeWidth = 2.5 }) => (
  <Svg size={size} strokeWidth={strokeWidth}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </Svg>
);

/* ------------------------------------------------------------------ */
/* Rating                                                              */
/* ------------------------------------------------------------------ */

export const StarRating = ({ score }) => {
  const fullStars = Math.floor(score);

  return (
    <div
      className="flex items-center gap-[7px]"
      role="img"
      aria-label={`Rated ${score.toFixed(1)} out of 5`}
    >
      <span className="text-[13px] font-bold leading-none text-gold">
        {score.toFixed(1)}
      </span>
      <div className="flex gap-0.5 text-gold">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill={i <= fullStars ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Price                                                               */
/* ------------------------------------------------------------------ */

export const PriceTag = ({ price, original, freeLabel = "Free" }) => (
  <div className="flex flex-col gap-0.5">
    {original && (
      <span className="text-xs leading-none text-ink-muted line-through">
        {original}
      </span>
    )}
    {isFreePrice(price) ? (
      <span className="w-fit rounded bg-emerald-50 px-[11px] py-[5px] text-[13px] font-bold uppercase leading-none tracking-[0.1em] text-emerald-700">
        {freeLabel}
      </span>
    ) : (
      <span className="font-display text-[19px] font-bold leading-none tracking-[0.01em] text-navy sm:text-[22px]">
        {price}
      </span>
    )}
  </div>
);
