import React, { useState, useEffect, useMemo } from "react";
import { QuestionCard } from "./QuestionCard";
import { OptionItem } from "./OptionItem";

const MultipleChoiceRenderer = ({
  question,
  initialAnswer = "",
  frozenAnswer = "",
  showCorrectAnswer = false,
  answerStatus = {},
  correctAnswer = null,
  onAnswerChange,
  editable = true,
}) => {
  const hasCloze = useMemo(() => {
    return /<a\b[^>]*\bcloze\b/i.test(question?.question_text || "");
  }, [question?.question_text]);

  const extractSelected = (ans) => {
    if (typeof ans === "string") return ans;
    if (ans && typeof ans === "object") return ans.selectedOption || "";
    return "";
  };

  const extractCloze = (ans) => {
    if (ans && typeof ans === "object") {
      const { selectedOption, ...rest } = ans;
      return rest;
    }
    return {};
  };

  const [selectedAnswer, setSelectedAnswer] = useState(() =>
    extractSelected(initialAnswer)
  );
  const [clozeAnswers, setClozeAnswers] = useState(() =>
    extractCloze(initialAnswer)
  );

  useEffect(() => {
    setSelectedAnswer(extractSelected(initialAnswer));
    setClozeAnswers(extractCloze(initialAnswer));
  }, [initialAnswer]);

  const handleOptionChange = (optionText) => {
    if (!editable) return;
    setSelectedAnswer(optionText);

    if (hasCloze) {
      const merged = { ...clozeAnswers, selectedOption: optionText };
      onAnswerChange?.(question.id, merged);
    } else if (typeof initialAnswer === "object" && initialAnswer !== null) {
      const merged = { ...initialAnswer, selectedOption: optionText };
      onAnswerChange?.(question.id, merged);
    } else {
      onAnswerChange?.(question.id, optionText);
    }
  };

  const handleClozeChange = (key, val) => {
    const updated = { ...clozeAnswers, [key]: val };
    setClozeAnswers(updated);
    onAnswerChange?.(question.id, {
      ...updated,
      selectedOption: selectedAnswer,
    });
  };

  const effectiveCorrect = useMemo(() => {
    if (correctAnswer) return correctAnswer;
    const found = question?.options?.find(
      (opt) => opt.isCorrect || opt.is_correct
    );
    return found?.text || null;
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
      frozenAnswer={frozenAnswer}
      questionType="multiple-choice"
    >
      {question?.options?.map((option, index) => {
        const optionText = option.text?.trim() || "";
        const isSelected = selectedAnswer?.trim() === optionText;
        const letter = String.fromCharCode(65 + index); // A, B, C, D...

        let isCorrect = false;
        let isWrong = false;

        if (showCorrectAnswer) {
          const isThisCorrect = effectiveCorrect?.trim() === optionText;
          if (isThisCorrect) isCorrect = true;
          if (isSelected && !isThisCorrect) isWrong = true;
        }

        return (
          <OptionItem
            key={option.id ?? option.answerIndex ?? index}
            type="radio"
            name={`question-${question.id}`}
            selected={isSelected}
            isCorrect={isCorrect}
            isWrong={isWrong}
            disabled={!editable}
            indexBadge={letter}
            label={optionText}
            onClick={() => handleOptionChange(optionText)}
          />
        );
      })}
    </QuestionCard>
  );
};

export default MultipleChoiceRenderer;
