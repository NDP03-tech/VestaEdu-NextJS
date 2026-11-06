import React, { useState } from "react";

const FIELDS = [
  { name: "name", label: "Họ và Tên", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Số điện thoại", type: "tel", autoComplete: "tel" },
  { name: "course", label: "Khóa học muốn đăng ký", type: "text" },
];

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 " +
  "placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

const UserForm = ({ onFormComplete }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (Object.values(formData).some((value) => value.trim() === "")) {
      setMessage("❌ Vui lòng nhập đầy đủ thông tin trước khi tiếp tục!");
      return;
    }
    onFormComplete(formData); // Gửi thông tin tới component cha
  };

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="m-0 mb-5 text-center text-xl font-semibold tracking-tight text-slate-900">
        Thông tin liên hệ
      </h3>

      {message && (
        <div
          role="alert"
          className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {message}
        </div>
      )}

      <form onSubmit={handleConfirm} className="space-y-4">
        {FIELDS.map(({ name, label, type, autoComplete }) => (
          <div key={name} className="flex flex-col gap-1.5">
            <label
              htmlFor={`user-form-${name}`}
              className="text-sm font-medium text-slate-700"
            >
              {label}
            </label>
            <input
              id={`user-form-${name}`}
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              autoComplete={autoComplete}
              required
              className={inputClass}
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full cursor-pointer rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Xác nhận thông tin
        </button>
      </form>
    </div>
  );
};

export default UserForm;
