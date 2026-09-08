import React, { useState, useEffect } from "react";
import ClozeTextRenderer from "./ClozeTextRenderer";

const DescriptionRender = ({
  question,
  initialAnswer = {},
  onAnswerChange,
  editable = true,
  showCorrectAnswer = false,
  answerStatus = {},
  correctAnswer = {},
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

  if (!question || !question.question_text) {
    return <div>No description available.</div>;
  }

  const handleClozeChange = (key, value) => {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);
    onAnswerChange?.(question.id, updated);
  };

  return (
    <div className="description-render">
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
      />
    </div>
  );
};

export default DescriptionRender;
