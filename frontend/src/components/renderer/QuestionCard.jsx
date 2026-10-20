import React from "react";
import ClozeTextRenderer from "./ClozeTextRenderer";

export const QuestionCard = ({
  question,
  clozeAnswers,
  onClozeChange,
  editable = true,
  showCorrectAnswer = false,
  answerStatus = {},
  correctAnswer = null,
  frozenAnswer = {},
  questionType = "multiple-choice",
  children,
  className = "",
}) => {
  return (
    <div className={`space-y-4 text-slate-800 ${className}`}>
      {/* Question Prompt / Header */}
      {question?.question_text && (
        <div className="rounded-xl border-l-4 border-blue-500 bg-slate-50/80 p-5 shadow-sm">
          <ClozeTextRenderer
            questionText={question.question_text}
            questionType={question.question_type || questionType}
            answers={clozeAnswers}
            onAnswerChange={onClozeChange}
            question={question}
            editable={editable}
            showCorrectAnswer={showCorrectAnswer}
            answerStatus={answerStatus}
            correctAnswer={correctAnswer}
            frozenAnswers={
              frozenAnswer && typeof frozenAnswer === "object" ? frozenAnswer : {}
            }
            fontSize={16}
          />
        </div>
      )}

      {/* Answer Options / Content area */}
      <div className="space-y-3">{children}</div>
    </div>
  );
};

