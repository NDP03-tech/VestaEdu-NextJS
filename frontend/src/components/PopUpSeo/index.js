import React, { useEffect } from "react";
import sampleImage from "../../assets/images/course/1.jpg"; // Thay bằng ảnh thực tế của bạn

const PopupMessage = ({ message, onClose }) => {
  // Đóng popup khi nhấn Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    // Overlay: bấm ra ngoài để đóng
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Hộp thoại: chặn click lan ra overlay */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 bg-white/90 text-slate-600 shadow-sm transition-colors hover:bg-white hover:text-slate-900"
        >
          ✕
        </button>

        <img
          src={sampleImage}
          alt="Promo"
          className="h-48 w-full object-cover sm:h-56"
        />

        <div className="space-y-4 p-6 text-center">
          <div className="space-y-2">
            <h2
              id="popup-title"
              className="m-0 text-2xl font-semibold tracking-tight text-slate-900"
            >
              {message.title}
            </h2>
            <p className="m-0 text-sm leading-relaxed text-slate-500">
              {message.description}
            </p>
          </div>

          <input
            type="email"
            placeholder="Enter email address"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />

          <div className="space-y-2">
            <button
              type="button"
              className="w-full cursor-pointer rounded-lg border-0 bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Get my coupon
            </button>

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer border-0 bg-transparent px-2 py-1 text-sm text-slate-500 underline-offset-2 transition-colors hover:text-slate-700 hover:underline"
            >
              No thanks, just let me shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupMessage;
