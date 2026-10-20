import React, { useState } from "react";
import axios from "axios";
import config from "../../config";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

export const EventRegisterModal = ({ open, onClose, event = {} }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${config.API_URL}/api/event-registrations`, {
        ...formData,
        eventId: event.id,
        eventTitle: event.eventTitle || event.title,
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setFormData({ name: "", email: "", phone: "", note: "" });
        setSubmitted(false);
      }, 2200);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Đăng ký tham gia sự kiện thất bại. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Đăng ký tham gia sự kiện"
      maxWidth="max-w-xl"
    >
      {/* Event Details Card */}
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 p-5 text-white shadow-lg">
        <span className="text-[11px] font-semibold tracking-widest text-amber-400 uppercase block mb-1">
          Sự kiện đặc biệt
        </span>
        <h4 className="text-lg font-bold text-white mb-2 leading-snug">
          {event?.eventTitle || event?.title || "Sự kiện Vesta"}
        </h4>
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 border-t border-white/10">
          {(event?.eventDate || event?.date) && (
            <span className="flex items-center gap-1.5">
              📅 {event.eventDate || event.date}
            </span>
          )}
          {(event?.eventTime || event?.time) && (
            <span className="flex items-center gap-1.5">
              ⏰ {event.eventTime || event.time}
            </span>
          )}
          {(event?.eventLocation || event?.location) && (
            <span className="flex items-center gap-1.5">
              📍 {event.eventLocation || event.location}
            </span>
          )}
        </div>
      </div>

      {submitted ? (
        /* Success screen */
        <div className="flex flex-col items-center py-6 text-center animate-fade-in">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <polyline
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                points="20 6 9 17 4 12"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Đăng ký tham gia thành công!</h3>
          <p className="text-sm text-slate-500 max-w-sm">
            Vé mời và thông tin chi tiết sẽ được gửi qua email của bạn. Hẹn gặp lại bạn tại sự kiện!
          </p>
        </div>
      ) : (
        /* Event Register Form */
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Nguyễn Văn A"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="0912 345 678"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Ghi chú thêm (Tuỳ chọn)
            </label>
            <textarea
              name="note"
              rows={2}
              placeholder="Bạn có câu hỏi nào gửi tới ban tổ chức không?"
              value={formData.note}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 flex items-center gap-2 border border-red-100">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={loading}
            className="w-full py-3 mt-2 rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            Xác nhận tham gia
          </Button>

          <p className="text-center text-xs text-slate-400 pt-1">
            🔒 Thông tin của bạn được cam kết bảo mật 100%
          </p>
        </form>
      )}
    </Modal>
  );
};

export default EventRegisterModal;
