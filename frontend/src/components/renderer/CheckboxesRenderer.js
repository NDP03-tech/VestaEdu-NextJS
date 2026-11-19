import React, { useState, useEffect, useMemo } from "react";
import { QuestionCard } from "./QuestionCard";
import { OptionItem } from "./OptionItem";

const CheckboxesRenderer = ({
  question,
  initialAnswer = [],
  onAnswerChange = () => {},
  correctAnswer = [],
  showCorrectAnswer = false,
  answerStatus = {},
  editable = true,
}) => {
  const hasCloze = useMemo(() => {
    return /<a\b[^>]*\bcloze\b/i.test(question?.question_text || "");
  }, [question?.question_text]);

  const extractSelected = (ans) => {
    if (Array.isArray(ans)) return ans.map((val) => Number(val));
    if (ans && typeof ans === "object" && Array.isArray(ans.selectedOptions)) {
      return ans.selectedOptions.map((val) => Number(val));
    }
    return [];
  };

  const extractCloze = (ans) => {
    if (ans && typeof ans === "object" && !Array.isArray(ans)) {
      const { selectedOptions, ...rest } = ans;
      return rest;
    }
    return {};
  };

  const [userAnswers, setUserAnswers] = useState(() =>
    extractSelected(initialAnswer)
  );
  const [clozeAnswers, setClozeAnswers] = useState(() =>
    extractCloze(initialAnswer)
  );

  useEffect(() => {
    setUserAnswers(extractSelected(initialAnswer));
    setClozeAnswers(extractCloze(initialAnswer));
  }, [initialAnswer]);

  const handleCheckboxChange = (optId) => {
    if (!editable) return;
    const numericId = Number(optId);
    let updated;
    if (userAnswers.includes(numericId)) {
      updated = userAnswers.filter((id) => id !== numericId);
    } else {
      updated = [...userAnswers, numericId];
    }
    setUserAnswers(updated);

    if (hasCloze) {
      onAnswerChange(question.id, {
        ...clozeAnswers,
        selectedOptions: updated,
      });
    } else {
      onAnswerChange(question.id, updated);
    }
  };

  const handleClozeChange = (key, val) => {
    const updated = { ...clozeAnswers, [key]: val };
    setClozeAnswers(updated);
    onAnswerChange(question.id, {
      ...updated,
      selectedOptions: userAnswers,
    });
  };

  const correctAnswersList = useMemo(() => {
    if (Array.isArray(correctAnswer) && correctAnswer.length > 0) {
      return correctAnswer.map((v) => Number(v));
    }
    return (
      question?.options
        ?.filter((opt) => opt.isCorrect || opt.is_correct)
        ?.map((opt, index) =>
          Number(opt.answerIndex ?? opt.id ?? index),
        ) || []
    );
  }, [correctAnswer, question?.options]);

  return (
    <QuestionCard
      question={question}
      clozeAnswers={clozeAnswers}
      onClozeChange={handleClozeChange}
      editable={editable}
      showCorrectAnswer={showCorrectAnswer}
      answerStatus={answerStatus}
      correctAnswer={correctAnswer}
      questionType="checkboxes"
    >
      {question?.options?.map((option, index) => {
        const optId = Number(option.answerIndex ?? option.id ?? index);
        const isSelected = userAnswers.includes(optId);
        const letter = String.fromCharCode(65 + index);

        let isCorrect = false;
        let isWrong = false;

        if (showCorrectAnswer) {
          const isTargetCorrect = correctAnswersList.includes(optId);
          if (isTargetCorrect) isCorrect = true;
          if (isSelected && !isTargetCorrect) isWrong = true;
        }

        return (
          <OptionItem
            key={optId}
            type="checkbox"
            name={`question-${question.id}-${optId}`}
            selected={isSelected}
            isCorrect={isCorrect}
            isWrong={isWrong}
            disabled={!editable}
            indexBadge={letter}
            label={option.text}
            onClick={() => handleCheckboxChange(optId)}
          />
        );
      })}
    </QuestionCard>
  );
};

export default CheckboxesRenderer;
