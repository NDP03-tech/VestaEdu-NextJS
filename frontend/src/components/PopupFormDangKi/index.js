import React, { useState } from "react";
import emailjs from "emailjs-com";

const FIELDS = [
  {
    name: "name",
    type: "text",
    placeholder: "Tên của bạn",
    autoComplete: "name",
  },
  { name: "email", type: "email", placeholder: "Email", autoComplete: "email" },
  {
    name: "phone",
    type: "tel",
    placeholder: "Số điện thoại",
    autoComplete: "tel",
  },
];

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 " +
  "placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

const RegisterForm = ({ courseTitle, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Course Title:", courseTitle);

    // Gửi email xác nhận cho học viên
    const studentEmail = emailjs.send(
      "service_addy4sj",
      "template_g0mp0fa",
      {
        courseTitle,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      "gY_asaAKpxmYdIg29",
    );

    // Gửi email thông báo cho admin
    const adminEmail = emailjs.send(
      "service_addy4sj",
      "template_ff0z4pb",
      {
        courseTitle,
        studentName: formData.name,
        studentEmail: formData.email,
        studentPhone: formData.phone,
        adminEmail: " info@vestaedu.online", // Thay bằng email admin thực tế
      },
      "gY_asaAKpxmYdIg29",
    );

    // Xử lý cả hai email cùng lúc
    Promise.all([studentEmail, adminEmail])
      .then(() => {
        alert("Đăng ký thành công! Kiểm tra email.");
        onClose();
      })
      .catch((error) => {
        console.error("Lỗi khi gửi email:", error);
        alert("Đăng ký thất bại! Hãy thử lại.");
      });
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-title"
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <div className="mb-5">
          <h2
            id="register-title"
            className="m-0 text-xl font-semibold tracking-tight text-slate-900"
          >
            Đăng ký khóa học
          </h2>
          <p className="mt-1 text-sm text-slate-500">{courseTitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {FIELDS.map(({ name, type, placeholder, autoComplete }) => (
            <div key={name}>
              <label htmlFor={`register-${name}`} className="sr-only">
                {placeholder}
              </label>
              <input
                id={`register-${name}`}
                type={type}
                name={name}
                placeholder={placeholder}
                autoComplete={autoComplete}
                value={formData[name]}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          ))}

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-lg border-0 bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Gửi đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
