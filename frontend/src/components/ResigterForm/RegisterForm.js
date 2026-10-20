import React, { useState } from "react";
import config from "../../config";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

const API_BASE_URL = config.API_URL;

export const RegisterForm = ({ courseTitle, courseId, onClose, open }) => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
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
      const res = await fetch(`${API_BASE_URL}/api/course-registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, courseId, courseTitle }),
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
          setFormData({ name: "", email: "", phone: "" });
          setSubmitted(false);
        }, 2200);
      } else {
        const err = await res.json();
        setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch {
      setError("Lỗi kết nối. Vui lòng kiểm tra mạng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Đăng ký khoá học" maxWidth="max-w-lg">
      {/* Course Subheader */}
      <div className="mb-6 rounded-xl bg-blue-50/70 p-4 border border-blue-100/80">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 block mb-1">
          Khoá học lựa chọn
        </span>
        <h4 className="text-base font-bold text-slate-800 leading-snug">
          {courseTitle || "Khoá học"}
        </h4>
      </div>

      {submitted ? (
        /* Success State */
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
          <h3 className="text-xl font-bold text-slate-800 mb-2">Đăng ký thành công!</h3>
          <p className="text-sm text-slate-500 max-w-sm">
            Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất. Cảm ơn bạn đã tin tưởng Vesta Academy.
          </p>
        </div>
      ) : (
        /* Registration Form */
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                type="text"
                name="name"
                required
                placeholder="Nguyễn Văn A"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                type="email"
                name="email"
                required
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <input
                type="tel"
                name="phone"
                required
                placeholder="0912 345 678"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              />
            </div>
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
            Xác nhận đăng ký
          </Button>

          <p className="text-center text-xs text-slate-400 pt-2">
            ✦ Thông tin của bạn được bảo mật tuyệt đối
          </p>
        </form>
      )}
    </Modal>
  );
};

export default RegisterForm;
