import React from "react";

const QUESTION_TYPES = [
  { value: "blank-boxes", label: "Blank Boxes & Dropdowns" },
  { value: "generated-dropdowns", label: "Generated Dropdowns" },
  { value: "drag-drop-matching", label: "Drag & Drop / Matching" },
  { value: "find-highlight", label: "Find & Highlight (word search)" },
  { value: "multiple-choice", label: "Multiple Choice (one answer correct)" },
  { value: "checkboxes", label: "Checkboxes (several answers correct)" },
  { value: "essay", label: "Essay (open-ended question)" },
  { value: "speaking", label: "Speaking (Record speaking)" },
  { value: "reading", label: "Reading Task (open-ended question)" },
  { value: "description", label: "Description" },
];

const QuestionType = ({ questionType, setQuestionType }) => {
  const handleChange = (event) => {
    setQuestionType(event.target.value); // Cập nhật loại câu hỏi
  };

  return (
    <div>
      <select
        id="questionType"
        value={questionType}
        onChange={handleChange}
        className="w-full cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <option value="">-- Chọn loại câu hỏi --</option>
        {QUESTION_TYPES.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default QuestionType;
