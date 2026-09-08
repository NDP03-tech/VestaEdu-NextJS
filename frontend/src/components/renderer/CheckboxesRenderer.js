import React, { useState, useEffect, useMemo } from "react";
import parse from "html-react-parser";
import ClozeTextRenderer from "./ClozeTextRenderer";

const CheckboxesRenderer = ({
  question,
  initialAnswer = [],
  onAnswerChange = () => {},
  correctAnswer = [],
  showCorrectAnswer = false,
  answerStatus = {}, // 👈 truyền vào
  editable = true, // ✅ NEW: Control whether user can edit
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
  const [options, setOptions] = useState([]);
  const [hoveredOption, setHoveredOption] = useState(null);

  useEffect(() => {
    // Add animation styles if not exists
    if (!document.getElementById("checkboxes-animations")) {
      const style = document.createElement("style");
      style.id = "checkboxes-animations";
      style.textContent = `
        @keyframes checkbox-check {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes icon-appear {
          0% { opacity: 0; transform: scale(0.5) rotate(-45deg); }
          50% { transform: scale(1.2) rotate(5deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes shake-incorrect {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    setOptions(question?.options || []);
    setUserAnswers(extractSelected(initialAnswer));
    setClozeAnswers(extractCloze(initialAnswer));
  }, [question?.id, initialAnswer, question?.options]);

  const handleOptionChange = (index) => {
    if (!editable) return; // ✅ FIX: Check editable instead of showCorrectAnswer

    const updated = userAnswers.includes(index)
      ? userAnswers.filter((i) => i !== index)
      : [...userAnswers, index];

    setUserAnswers(updated);

    if (hasCloze) {
      const merged = { ...clozeAnswers, selectedOptions: updated };
      onAnswerChange(question.id, merged);
    } else if (
      typeof initialAnswer === "object" &&
      initialAnswer !== null &&
      !Array.isArray(initialAnswer)
    ) {
      const merged = { ...initialAnswer, selectedOptions: updated };
      onAnswerChange(question.id, merged);
    } else {
      onAnswerChange(question.id, updated);
    }
  };

  const handleClozeChange = (key, val) => {
    const updated = {
      ...clozeAnswers,
      [key]: val,
      selectedOptions: userAnswers,
    };
    setClozeAnswers(updated);
    onAnswerChange(question.id, updated);
  };

  const getOptionStyle = (index, isChecked, isHovered) => {
    // ✅ FIX: Safely check answerStatus
    const userSelected = Array.isArray(answerStatus?.selected)
      ? answerStatus.selected.includes(index)
      : false;
    const isCorrectOption = Array.isArray(correctAnswer)
      ? correctAnswer.includes(index)
      : false;

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
    };

    // Show answer styling
    if (showCorrectAnswer && userSelected) {
      if (isCorrectOption) {
        baseStyle.backgroundColor = "#f6ffed";
        baseStyle.borderColor = "#52c41a";
        baseStyle.boxShadow = "0 4px 12px rgba(82, 196, 26, 0.15)";
      } else {
        baseStyle.backgroundColor = "#fff2f0";
        baseStyle.borderColor = "#ff4d4f";
        baseStyle.boxShadow = "0 4px 12px rgba(255, 77, 79, 0.15)";
      }
    }
    // Normal hover effect
    else if (isHovered && editable) {
      // ✅ FIX: Check editable
      baseStyle.borderColor = "#40a9ff";
      baseStyle.backgroundColor = "#f0f8ff";
      baseStyle.transform = "translateX(4px)";
      baseStyle.boxShadow = "0 4px 12px rgba(24, 144, 255, 0.15)";
    }
    // Checked style
    else if (isChecked && editable) {
      // ✅ FIX: Check editable
      baseStyle.borderColor = "#1890ff";
      baseStyle.backgroundColor = "#e6f7ff";
      baseStyle.boxShadow = "0 6px 16px rgba(24, 144, 255, 0.2)";
    }

    return baseStyle;
  };

  const getCheckboxStyle = (isChecked) => {
    return {
      appearance: "none",
      width: 22,
      height: 22,
      minWidth: 22,
      minHeight: 22,
      border: "2px solid",
      borderColor: isChecked ? "#1890ff" : "#d9d9d9",
      borderRadius: 6,
      marginRight: 12,
      marginTop: 2,
      cursor: !editable ? "not-allowed" : "pointer", // ✅ FIX: Check editable
      position: "relative",
      transition: "all 0.2s ease",
      backgroundColor: isChecked ? "#1890ff" : "white",
      outline: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...(isChecked && {
        boxShadow: "0 0 0 3px rgba(24, 144, 255, 0.15)",
      }),
    };
  };

  const renderIcon = (index) => {
    // ✅ FIX: Safely check conditions
    if (!showCorrectAnswer) return null;

    const userSelected = Array.isArray(answerStatus?.selected)
      ? answerStatus.selected.includes(index)
      : false;
    const isCorrectOption = Array.isArray(correctAnswer)
      ? correctAnswer.includes(index)
      : false;

    if (!userSelected) return null;

    const isCorrect = isCorrectOption;

    return (
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
    );
  };

  // ✅ FIX: Safely handle null/undefined question
  if (!question || !question.question_text) {
    return <div>No question available</div>;
  }

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
          questionText={question?.question_text}
          questionType={question?.question_type || "checkboxes"}
          answers={clozeAnswers}
          onAnswerChange={handleClozeChange}
          question={question}
          editable={editable}
          showCorrectAnswer={showCorrectAnswer}
          answerStatus={answerStatus}
          correctAnswer={correctAnswer}
          fontSize={16}
        />
      </div>

      {/* Options */}
      <div style={{ marginTop: 20 }}>
        {options.map((option, index) => {
          const isChecked = userAnswers.includes(index);
          const isHovered = hoveredOption === index;
          const icon = renderIcon(index);

          return (
            <div
              key={index}
              style={getOptionStyle(index, isChecked, isHovered)}
              onClick={() => handleOptionChange(index)}
              onMouseEnter={() => editable && setHoveredOption(index)} // ✅ FIX: Check editable
              onMouseLeave={() => setHoveredOption(null)}
            >
              {/* Custom Checkbox */}
              <div style={{ position: "relative" }}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleOptionChange(index)}
                  disabled={!editable} // ✅ FIX: Disable based on editable
                  style={getCheckboxStyle(isChecked)}
                />
                {isChecked && (
                  <svg
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 14,
                      height: 14,
                      pointerEvents: "none",
                      animation: "checkbox-check 0.3s ease",
                    }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
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
                    backgroundColor: isChecked ? "#1890ff" : "#f0f0f0",
                    color: isChecked ? "white" : "#595959",
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
                    fontWeight: isChecked ? 500 : 400,
                  }}
                >
                  {parse(option?.text || "")}
                </span>
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
            backgroundColor: "#fff7e6",
            borderRadius: 8,
            border: "1px solid #ffd591",
            fontSize: 13,
            color: "#fa8c16",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>💡</span>
          <span>You can select multiple answers for this question</span>
        </div>
      )}
    </div>
  );
};

export default CheckboxesRenderer;
