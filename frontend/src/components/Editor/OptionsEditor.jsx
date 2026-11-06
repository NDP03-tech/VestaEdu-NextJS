import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const EDITOR_INIT = {
  height: 200,
  menubar: false,
  plugins: "link image code lists",
  toolbar:
    "undo redo | bold italic underline | bullist numlist | link image | code",
  content_style: `
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 15px;
      line-height: 1.6;
      padding: 10px;
    }
  `,
};

// "single": chỉ 1 đáp án đúng (radio) | "multiple": nhiều đáp án đúng (checkbox)
const VARIANTS = {
  single: {
    inputType: "radio",
    title: "Multiple choice options",
    description: "Select one correct answer.",
    badge: "Correct answer",
    tip: "Click the radio button to mark the correct answer. Use the Edit button for rich formatting.",
    showCorrectCount: false,
    select: (options, index) =>
      options.map((option, i) => ({ ...option, isCorrect: i === index })),
  },
  multiple: {
    inputType: "checkbox",
    title: "Multiple correct answers",
    description: "Select multiple correct answers.",
    badge: "Correct",
    tip: "Check the boxes to mark correct answers. You can select multiple correct options.",
    showCorrectCount: true,
    select: (options, index) =>
      options.map((option, i) =>
        i === index ? { ...option, isCorrect: !option.isCorrect } : option,
      ),
  },
};

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 " +
  "placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const OptionsEditor = ({ variant = "single", options = [], setOptions }) => {
  const v = VARIANTS[variant];
  const [editingIndex, setEditingIndex] = useState(null);

  const list = Array.isArray(options) ? options : [];
  const canRemove = list.length > 2;
  const correctCount = list.filter((option) => option.isCorrect).length;

  const updateText = (index, text) =>
    setOptions(
      list.map((option, i) => (i === index ? { ...option, text } : option)),
    );

  const handleRemoveOption = (index) => {
    setOptions(list.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const handleAddOption = () => {
    setOptions([...list, { text: "", isCorrect: false }]);
  };

  return (
    <div className="space-y-3 p-4">
      {/* Header */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="text-sm font-semibold text-slate-800">{v.title}</div>
        <div className="mt-0.5 text-xs text-slate-500">
          {v.description} {list.length} options
          {v.showCorrectCount && `, ${correctCount} correct`}
        </div>
      </div>

      {/* Options */}
      {list.map((option, index) => {
        const isEditing = editingIndex === index;
        const isCorrect = !!option.isCorrect;

        return (
          <div
            key={option._id || index}
            className={`rounded-xl border bg-white p-4 shadow-sm transition-colors ${
              isCorrect
                ? "border-emerald-500"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type={v.inputType}
                name={v.inputType === "radio" ? "multiple-choice" : undefined}
                checked={isCorrect}
                onChange={() => setOptions(v.select(list, index))}
                aria-label={`Mark option ${String.fromCharCode(65 + index)} as correct`}
                className="h-5 w-5 shrink-0 cursor-pointer accent-emerald-600"
              />

              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  isCorrect
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>

              {isCorrect && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                  {v.badge}
                </span>
              )}

              <div className="flex-1" />

              <button
                type="button"
                onClick={() => setEditingIndex(isEditing ? null : index)}
                title={isEditing ? "Close editor" : "Open rich text editor"}
                className="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                {isEditing ? "Close" : "Edit"}
              </button>

              <button
                type="button"
                onClick={() => handleRemoveOption(index)}
                disabled={!canRemove}
                title="Remove option"
                className="cursor-pointer rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
              >
                Remove
              </button>
            </div>

            <div className="mt-3">
              {isEditing ? (
                <div className="overflow-hidden rounded-md border border-slate-300">
                  <Editor
                    apiKey="no-api-key"
                    value={option.text}
                    init={EDITOR_INIT}
                    onEditorChange={(content) => updateText(index, content)}
                  />
                </div>
              ) : (
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => updateText(index, e.target.value)}
                  className={inputClass}
                  placeholder={`Enter option ${index + 1} text...`}
                />
              )}
            </div>

            {!option.text && !isEditing && (
              <p className="mb-0 mt-2 text-xs text-red-500">
                This option is empty
              </p>
            )}
          </div>
        );
      })}

      {/* Add option */}
      <button
        type="button"
        onClick={handleAddOption}
        className="w-full cursor-pointer rounded-lg border border-dashed border-slate-300 bg-white py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-blue-500 hover:text-blue-600"
      >
        + Add option
      </button>

      {/* Tip */}
      <p className="m-0 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
        {v.tip}
      </p>
    </div>
  );
};

export default OptionsEditor;
