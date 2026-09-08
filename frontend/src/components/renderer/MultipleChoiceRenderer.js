import React, { useState, useEffect, useMemo } from "react";
import ClozeTextRenderer from "./ClozeTextRenderer";

const MultipleChoiceRenderer = ({
  question,
  initialAnswer = "",
  frozenAnswer = "",
  showCorrectAnswer = false,
  answerStatus = {},
  correctAnswer = null,
  onAnswerChange,
  editable = true, // ✅ NEW: Control whether user can edit
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
  const [hoveredOption, setHoveredOption] = useState(null);

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
    const updated = {
      ...clozeAnswers,
      [key]: val,
      ...(selectedAnswer ? { selectedOption: selectedAnswer } : {}),
    };
    setClozeAnswers(updated);
    onAnswerChange?.(question.id, updated);
  };

  const renderIconAndStyle = (option) => {
    const optionText = option.text?.trim();
    const wasSubmittedAnswer = frozenAnswer?.trim?.() === optionText;

    // Chỉ hiển thị icon khi showCorrectAnswer = true và đây là câu trả lời đã submit
    if (!showCorrectAnswer || !frozenAnswer || !wasSubmittedAnswer) return {};

    const isCorrect = option.isCorrect;
    return {
      icon: (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 10,
            width: 24,
            height: 24,
            borderRadius: "50%",
            backgroundColor: isCorrect ? "#52c41a" : "#ff4d4f",
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
            animation: `icon-appear 0.4s ease${
              !isCorrect ? ", shake-incorrect 0.5s ease 0.4s" : ""
            }`,
            boxShadow: isCorrect
              ? "0 2px 8px rgba(82, 196, 26, 0.4)"
              : "0 2px 8px rgba(255, 77, 79, 0.4)",
          }}
        >
          {isCorrect ? "✓" : "✗"}
        </span>
      ),
      style: {
        backgroundColor: isCorrect ? "#f6ffed" : "#fff2f0",
        borderColor: isCorrect ? "#52c41a" : "#ff4d4f",
        borderWidth: 2,
        boxShadow: isCorrect
          ? "0 4px 12px rgba(82, 196, 26, 0.15)"
          : "0 4px 12px rgba(255, 77, 79, 0.15)",
      },
    };
  };

  const getOptionStyle = (option, index, isSelected, isHovered) => {
    const optionText = option.text?.trim();
    const wasSubmittedAnswer = frozenAnswer?.trim?.() === optionText;
    const { style: statusStyle } = renderIconAndStyle(option);

    // Base style
    const baseStyle = {
      display: "flex",
      alignItems: "flex-start",
      marginBottom: 16,
      padding: "16px 18px",
      borderRadius: 12,
      border: "2px solid",
      borderColor: "#e8e8e8",
      backgroundColor: "#ffffff",
      cursor: !editable ? "not-allowed" : "pointer", // ✅ FIX: Check editable
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      userSelect: "none",
      ...statusStyle,
    };

    // Hover effect (only when not showing answer)
    if (isHovered && editable) {
      // ✅ FIX: Check editable
      baseStyle.borderColor = "#40a9ff";
      baseStyle.backgroundColor = "#f0f8ff";
      baseStyle.transform = "translateX(4px)";
      baseStyle.boxShadow = "0 4px 12px rgba(24, 144, 255, 0.15)";
    }

    // Selected style
    if (isSelected && editable) {
      // ✅ FIX: Check editable
      baseStyle.borderColor = "#1890ff";
      baseStyle.backgroundColor = "#e6f7ff";
      baseStyle.boxShadow = "0 6px 16px rgba(24, 144, 255, 0.2)";
    }

    return baseStyle;
  };

  const getRadioStyle = (isSelected) => {
    return {
      appearance: "none",
      width: 20,
      height: 20,
      minWidth: 20,
      minHeight: 20,
      border: "2px solid",
      borderColor: isSelected ? "#1890ff" : "#d9d9d9",
      borderRadius: "50%",
      marginRight: 12,
      marginTop: 2,
      cursor: !editable ? "not-allowed" : "pointer", // ✅ FIX: Check editable
      position: "relative",
      transition: "all 0.2s ease",
      backgroundColor: "white",
      outline: "none",
      ...(isSelected && {
        backgroundColor: "#1890ff",
        boxShadow: "0 0 0 3px rgba(24, 144, 255, 0.15)",
      }),
    };
  };

  return (
    <div
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: 16,
        color: "#262626",
        lineHeight: 1.8,
      }}
    >
      {/* Question Text */}
      {question?.question_text && (
        <div
          style={{
            marginBottom: 24,
            padding: "20px 24px",
            backgroundColor: "#fafafa",
            borderRadius: 12,
            borderLeft: "4px solid #1890ff",
            fontSize: 16,
            lineHeight: 1.8,
          }}
        >
          <ClozeTextRenderer
            questionText={question.question_text}
            questionType={question.question_type || "multiple-choice"}
            answers={clozeAnswers}
            onAnswerChange={handleClozeChange}
            question={question}
            editable={editable}
            showCorrectAnswer={showCorrectAnswer}
            answerStatus={answerStatus}
            correctAnswer={correctAnswer}
            frozenAnswers={
              frozenAnswer && typeof frozenAnswer === "object"
                ? frozenAnswer
                : {}
            }
            fontSize={16}
          />
        </div>
      )}

      {/* Options */}
      <div style={{ marginTop: 20 }}>
        {question?.options?.map((option, index) => {
          const optionText = option.text?.trim();
          const isSelected = selectedAnswer?.trim() === optionText;
          const isHovered = hoveredOption === index;
          const { icon } = renderIconAndStyle(option);

          return (
            <div
              key={option.id || index}
              style={getOptionStyle(option, index, isSelected, isHovered)}
              onClick={() => handleOptionChange(optionText)}
              onMouseEnter={() => editable && setHoveredOption(index)}
              onMouseLeave={() => setHoveredOption(null)}
            >
              {/* Custom Radio Button */}
              <div style={{ position: "relative" }}>
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={isSelected}
                  onChange={() => handleOptionChange(optionText)}
                  disabled={!editable}
                  style={getRadioStyle(isSelected)}
                />
                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "white",
                      pointerEvents: "none",
                      animation: "radio-check 0.3s ease",
                    }}
                  />
                )}
              </div>

              {/* Option Content */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: isSelected ? "#1890ff" : "#f0f0f0",
                    color: isSelected ? "white" : "#595959",
                    fontWeight: 600,
                    fontSize: 14,
                    marginRight: 12,
                    transition: "all 0.3s ease",
                  }}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: 15,
                    color: "#262626",
                    fontWeight: isSelected ? 500 : 400,
                  }}
                  dangerouslySetInnerHTML={{ __html: option.text }}
                />
                {icon}
              </div>
            </div>
          );
        })}
      </div>

      {/* Helper Text */}
      {!showCorrectAnswer && (
        <div
          style={{
            marginTop: 20,
            padding: "12px 16px",
            backgroundColor: "#f0f8ff",
            borderRadius: 8,
            border: "1px solid #d6e4ff",
            fontSize: 13,
            color: "#1890ff",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>💡</span>
          <span>Click on any option to select your answer</span>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceRenderer;
