import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

const TINYMCE_API_KEY = "n37usgxk136y7jbgbd22rrry2ki2agrdp3zzkfg8gc0adi22";

const EDITOR_INIT = {
  height: 200,
  menubar: false,
  plugins: ["link", "lists", "image", "paste"],
  toolbar: "bold italic underline | bullist numlist | link image",
  branding: false,
  images_upload_handler: (blobInfo, success, failure) => {
    const reader = new FileReader();
    reader.onload = () => success(reader.result);
    reader.onerror = () => failure("Failed to read file");
    reader.readAsDataURL(blobInfo.blob());
  },
};

// Style cho HTML do TinyMCE sinh ra (Tailwind preflight đã reset list, link...)
const CONTENT_CLASSES =
  "text-sm leading-relaxed text-slate-800 " +
  "[&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 " +
  "[&_a]:text-blue-600 [&_a]:underline [&_img]:h-auto [&_img]:max-w-full";

const ExplanationEditor = ({ value, onChange }) => {
  const [content, setContent] = useState(value || "");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setContent(value || "");
  }, [value]);

  const handleEditorChange = (newValue) => {
    setContent(newValue);
    onChange(newValue);
  };

  const startEditing = () => setIsEditing(true);

  if (isEditing) {
    return (
      <Editor
        apiKey={TINYMCE_API_KEY}
        value={content}
        init={EDITOR_INIT}
        onEditorChange={handleEditorChange}
      />
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={startEditing}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          startEditing();
        }
      }}
      className="min-h-[120px] cursor-pointer p-4 transition-colors hover:bg-slate-50 focus:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500/30"
    >
      {content ? (
        <div
          className={CONTENT_CLASSES}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <p className="m-0 text-sm italic text-slate-400">
          Click to add explanation...
        </p>
      )}
    </div>
  );
};

export default ExplanationEditor;
