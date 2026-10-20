import React, { useState, useEffect } from "react";
import ClozeTextRenderer from "./ClozeTextRenderer";

export const DescriptionRenderer = ({
  question,
  initialAnswer = {},
  onAnswerChange,
  editable = true,
  showCorrectAnswer = false,
  answerStatus = {},
  correctAnswer = {},
  className = "",
}) => {
  const [answers, setAnswers] = useState(
    typeof initialAnswer === "object" && initialAnswer !== null
      ? initialAnswer
      : {}
  );

  useEffect(() => {
    if (typeof initialAnswer === "object" && initialAnswer !== null) {
      setAnswers(initialAnswer);
    }
  }, [initialAnswer]);

  if (!question?.question_text) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
        No description available.
      </div>
    );
  }

  const handleClozeChange = (key, value) => {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);
    onAnswerChange?.(question.id, updated);
  };

  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${className}`}>
      <ClozeTextRenderer
        questionText={question.question_text}
        questionType={question.question_type || "description"}
        answers={answers}
        onAnswerChange={handleClozeChange}
        question={question}
        editable={editable}
        showCorrectAnswer={showCorrectAnswer}
        answerStatus={answerStatus}
        correctAnswer={correctAnswer}
        fontSize={16}
      />
    </div>
  );
};

export default DescriptionRenderer;
