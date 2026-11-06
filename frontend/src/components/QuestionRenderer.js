import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import BlankBoxesRenderer from "./renderer/BlankBoxesRenderer";
import MultipleChoiceRenderer from "./renderer/MultipleChoiceRenderer";
import CheckboxesRenderer from "./renderer/CheckboxesRenderer";
import EssayRenderer from "./renderer/EssayRenderer";
import DescriptionRenderer from "./renderer/DescriptionRenderer";
import GeneratedDropdownRender from "./renderer/GeneratedDropdownRenderer";
import FindHighlightRenderer from "./renderer/FindhighlightRenderer";
import DragDropRenderer from "./renderer/DragDropRenderer";
import SpeakingRenderer from "./renderer/SpeakingRenderer";
import ReadingRenderer from "./renderer/ReadingRenderer";

// Small notice used for invalid / missing / unsupported states
const Notice = ({ title, children }) => (
  <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-50">
      <AlertCircle className="h-4 w-4 text-amber-600" />
    </div>
    <div className="space-y-0.5">
      <p className="text-sm font-medium text-slate-900">{title}</p>
      {children && <p className="text-xs text-slate-500">{children}</p>}
    </div>
  </div>
);

const QuestionRenderer = ({
  question,
  initialAnswer,
  onAnswerChange,
  showCorrectAnswer,
  frozenAnswers,
  correctAnswers,
  editable = true,
}) => {
  // ✅ ALWAYS call hooks at the top, before any conditions
  const [frozenAnswerStatus, setFrozenAnswerStatus] = useState({});

  const questionType = question?.questionType || question?.question_type;

  // ✅ Safe answer extraction with error handling
  const getAnswerFromCorrectAnswers = () => {
    try {
      if (!Array.isArray(correctAnswers)) {
        return null;
      }

      const found = correctAnswers.find((ca) => {
        if (!ca || ca.question === undefined) return false;
        return ca.question.toString() === question.id.toString();
      });

      return found?.answer ?? null;
    } catch (error) {
      console.error("❌ Error in getAnswerFromCorrectAnswers:", error);
      return null;
    }
  };

  const correctAnswerFromAPI = getAnswerFromCorrectAnswers();

  // ✅ Safe type checking for correctAnswer
  const correctAnswer = (() => {
    try {
      if (correctAnswerFromAPI === null || correctAnswerFromAPI === undefined) {
        return null;
      }

      // Arrays (checkboxes, find-highlight)
      if (Array.isArray(correctAnswerFromAPI)) {
        return correctAnswerFromAPI;
      }

      // Objects (blank-boxes, dropdowns, drag-drop, reading)
      if (typeof correctAnswerFromAPI === "object") {
        return correctAnswerFromAPI;
      }

      // Strings should not be used as correctAnswer for structured questions
      return null;
    } catch (error) {
      console.error("❌ Error processing correctAnswer:", error);
      return null;
    }
  })();

  // ✅ Safe essay answer extraction
  const frozenEssayAnswer = (() => {
    try {
      return typeof correctAnswerFromAPI === "string"
        ? correctAnswerFromAPI
        : "";
    } catch (error) {
      console.error("❌ Error processing frozenEssayAnswer:", error);
      return "";
    }
  })();

  // ✅ Safe frozenAnswer extraction
  const frozenAnswer = (() => {
    try {
      return frozenAnswers?.[question.id] ?? null;
    } catch (error) {
      console.error("❌ Error accessing frozenAnswer:", error);
      return null;
    }
  })();

  // ✅ Safe answer status functions
  const getAnswerStatus = (userAnswer, correctAnswer) => {
    try {
      const status = {};
      if (
        !userAnswer ||
        !correctAnswer ||
        typeof userAnswer !== "object" ||
        typeof correctAnswer !== "object"
      ) {
        return status;
      }

      Object.keys(correctAnswer).forEach((key) => {
        const userVal = userAnswer[key]?.trim?.().toLowerCase?.() ?? "";
        const correctVal = correctAnswer[key]?.trim?.().toLowerCase?.() ?? "";
        status[key] = userVal === correctVal;
      });

      return status;
    } catch (error) {
      console.error("❌ Error in getAnswerStatus:", error);
      return {};
    }
  };

  const generateCheckboxAnswerStatus = (userAnswer, correctAnswer) => {
    try {
      return {
        selected: Array.isArray(userAnswer) ? [...userAnswer] : [],
        correct: Array.isArray(correctAnswer) ? [...correctAnswer] : [],
      };
    } catch (error) {
      console.error("❌ Error in generateCheckboxAnswerStatus:", error);
      return { selected: [], correct: [] };
    }
  };

  // ✅ Freeze answer status on first submit
  useEffect(() => {
    try {
      if (showCorrectAnswer && Object.keys(frozenAnswerStatus).length === 0) {
        if (questionType === "checkboxes") {
          setFrozenAnswerStatus(
            generateCheckboxAnswerStatus(initialAnswer, correctAnswer),
          );
        } else if (questionType !== "essay" && questionType !== "description") {
          setFrozenAnswerStatus(getAnswerStatus(initialAnswer, correctAnswer));
        }
      }
    } catch (error) {
      console.error("❌ Error in useEffect (freeze status):", error);
    }
  }, [showCorrectAnswer, questionType, initialAnswer, correctAnswer]);

  // ✅ Reset when not showing correct answer
  useEffect(() => {
    try {
      if (!showCorrectAnswer) {
        setFrozenAnswerStatus({});
      }
    } catch (error) {
      console.error("❌ Error in useEffect (reset status):", error);
    }
  }, [showCorrectAnswer]);

  const answerStatus = frozenAnswerStatus;

  // ✅ NOW check for invalid data AFTER all hooks
  if (!question) {
    console.error("❌ QuestionRenderer: question is null/undefined");
    return <Notice title="Invalid question data" />;
  }

  if (!questionType) {
    console.error("❌ QuestionRenderer: questionType is missing", question);
    return <Notice title="Missing question type" />;
  }

  // ✅ Render with error boundaries
  try {
    switch (questionType) {
      case "blank-boxes":
        return (
          <BlankBoxesRenderer
            question={question}
            editable={editable}
            initialAnswer={
              typeof initialAnswer === "object" ? initialAnswer : {}
            }
            onAnswerChange={onAnswerChange}
            correctAnswer={correctAnswer}
            answerStatus={answerStatus}
            showCorrectAnswer={showCorrectAnswer}
          />
        );

      case "generated-dropdowns":
        return (
          <GeneratedDropdownRender
            key={question.id}
            question={question}
            editable={editable}
            initialAnswer={
              typeof initialAnswer === "object" ? initialAnswer : {}
            }
            onAnswerChange={onAnswerChange}
            correctAnswer={correctAnswer}
            answerStatus={answerStatus}
            showCorrectAnswer={showCorrectAnswer}
          />
        );

      case "multiple-choice":
        return (
          <MultipleChoiceRenderer
            question={question}
            initialAnswer={
              typeof initialAnswer === "string" ? initialAnswer : ""
            }
            frozenAnswer={frozenAnswer}
            showCorrectAnswer={showCorrectAnswer}
            answerStatus={answerStatus}
            onAnswerChange={onAnswerChange}
            editable={editable}
          />
        );

      case "checkboxes":
        return (
          <CheckboxesRenderer
            question={question}
            initialAnswer={initialAnswer}
            onAnswerChange={onAnswerChange}
            correctAnswer={correctAnswer}
            showCorrectAnswer={showCorrectAnswer}
            answerStatus={answerStatus}
            editable={editable}
          />
        );

      case "drag-drop-matching":
        return (
          <DragDropRenderer
            question={question}
            questionId={question.id}
            initialAnswer={
              typeof initialAnswer === "object" ? initialAnswer : {}
            }
            onAnswerChange={onAnswerChange}
            correctAnswer={correctAnswer}
            showCorrectAnswer={showCorrectAnswer}
            answerStatus={answerStatus}
            editable={editable}
          />
        );

      case "find-highlight":
        return (
          <FindHighlightRenderer
            question={question}
            questionId={question.id}
            initialAnswer={Array.isArray(initialAnswer) ? initialAnswer : []}
            onAnswerChange={onAnswerChange}
            correctAnswer={correctAnswer}
            showCorrectAnswer={showCorrectAnswer}
            answerStatus={answerStatus}
            editable={editable}
          />
        );

      case "essay": {
        // ✅ Safe essay answer preparation
        const essayAnswer = (() => {
          try {
            if (showCorrectAnswer) {
              return frozenEssayAnswer || initialAnswer || "";
            }
            return initialAnswer || "";
          } catch (error) {
            console.error("❌ Error preparing essay answer:", error);
            return "";
          }
        })();

        return (
          <EssayRenderer
            question={question}
            initialAnswer={
              showCorrectAnswer
                ? ""
                : typeof initialAnswer === "string"
                  ? initialAnswer
                  : ""
            }
            frozenAnswer={
              showCorrectAnswer && typeof essayAnswer === "string"
                ? essayAnswer
                : ""
            }
            onAnswerChange={onAnswerChange}
            showCorrectAnswer={showCorrectAnswer}
            editable={editable}
          />
        );
      }

      case "reading":
        return (
          <ReadingRenderer
            question={question}
            initialAnswer={
              typeof initialAnswer === "object" ? initialAnswer : {}
            }
            onAnswerChange={onAnswerChange}
            frozenAnswers={typeof frozenAnswer === "object" ? frozenAnswer : {}}
            correctAnswer={correctAnswer}
            answerStatus={answerStatus}
            showCorrectAnswer={showCorrectAnswer}
            editable={editable}
          />
        );

      case "speaking":
        return (
          <SpeakingRenderer
            question={question}
            initialAnswer={
              typeof initialAnswer === "string" || initialAnswer instanceof File
                ? initialAnswer
                : null
            }
            onAnswerChange={onAnswerChange}
          />
        );

      case "description":
        return <DescriptionRenderer question={question} />;

      default:
        console.warn(`⚠️ Unsupported question type: ${questionType}`);
        return (
          <Notice title="Unsupported question type">{questionType}</Notice>
        );
    }
  } catch (error) {
    console.error("❌ Error rendering question:", error, question);
    return (
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-sm font-medium text-slate-900">
              Error rendering question
            </h3>
            <p className="text-xs text-red-600">{error.message}</p>
          </div>
        </div>

        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
          <dt className="font-medium uppercase tracking-wide text-slate-500">
            Question ID
          </dt>
          <dd className="text-slate-600">{question?.id}</dd>
          <dt className="font-medium uppercase tracking-wide text-slate-500">
            Type
          </dt>
          <dd className="text-slate-600">{questionType}</dd>
        </dl>

        <details className="group">
          <summary className="cursor-pointer text-xs font-medium text-slate-500 hover:text-slate-900">
            Debug info
          </summary>
          <pre className="mt-2 max-h-64 overflow-auto rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            {JSON.stringify(
              { question, initialAnswer, showCorrectAnswer },
              null,
              2,
            )}
          </pre>
        </details>
      </div>
    );
  }
};

export default QuestionRenderer;
