import React from "react";

// Khung có nhãn dùng chung cho các editor (Question text, Explanation, Bài đọc...)
const EditorSection = ({ label, children }) => (
  <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
    <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700">
      {label}
    </div>
    {children}
  </section>
);

export default EditorSection;
