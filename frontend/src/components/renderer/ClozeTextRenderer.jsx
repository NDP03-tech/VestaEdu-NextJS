import React, { useMemo, useState } from "react";
import { Tooltip } from "antd";

/**
 * Giải mã HTML entities (vd: &quot; -> ", &amp; -> &)
 */
function decodeHtmlEntities(str) {
  if (!str) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

/**
 * Xáo trộn mảng ngẫu nhiên
 */
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * ClozeTextRenderer
 * Component dùng chung parse và render nội dung có chứa marker .cloze:
 * - Hỗ trợ phân loại: gap, dropdown, hint
 * - Tự động chọn widget phù hợp theo questionType hoặc class marker
 * - Trả về HTML tĩnh nếu không có marker .cloze
 */
const ClozeTextRenderer = ({
  questionText = "",
  questionType = "blank-boxes",
  answers = {},
  onAnswerChange,
  question = {},
  editable = true,
  showCorrectAnswer = false,
  answerStatus = {},
  correctAnswer = {},
  frozenAnswers = {},
  fontSize = 15,
  style = {},
  className = "cloze-text-renderer",
}) => {
  // Cache các option đã xáo trộn cho từng dropdown key để không bị xáo trộn lại khi gõ phím
  const [shuffledOptionsMap, setShuffledOptionsMap] = useState({});

  // Kiểm tra xem có bất kỳ marker .cloze nào không
  const hasCloze = useMemo(() => {
    return /<a\b[^>]*\bcloze\b/i.test(questionText || "");
  }, [questionText]);

  // Nếu không có marker cloze, render tĩnh an toàn
  if (!hasCloze) {
    return (
      <div
        className={className}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: 1.8,
          ...style,
        }}
        dangerouslySetInnerHTML={{ __html: questionText || "" }}
      />
    );
  }

  const getStatusStyle = (key) => {
    if (!showCorrectAnswer) return {};
    const status = answerStatus?.[key];
    if (status === true) {
      return { backgroundColor: "#f6ffed", borderColor: "#52c41a", color: "#274fee" };
    }
    if (status === false) {
      return { backgroundColor: "#fff2f0", borderColor: "#ff4d4f", color: "#cf1322" };
    }
    return {};
  };

  const parseAndRender = () => {
    const container = document.createElement("div");
    container.innerHTML = questionText || "";

    let gapIndex = 0;
    let dropdownIndex = 0;
    let hintIndex = 0;

    const walkNodes = (node, pathKey = "root") => {
      const children = [];

      node.childNodes.forEach((child, i) => {
        const nodeKey = `${pathKey}-${i}`;

        if (child.nodeType === Node.TEXT_NODE) {
          if (child.textContent) {
            children.push(child.textContent);
          }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const el = child;
          const tagName = el.tagName.toLowerCase();
          const isVoidTag = [
            "br",
            "img",
            "hr",
            "input",
            "meta",
            "link",
          ].includes(tagName);

          const elemStyle = Object.fromEntries(
            [...el.style].map((k) => [k, el.style[k]])
          );

          if (el.classList.contains("cloze")) {
            const isDropdown =
              el.classList.contains("dropdown") ||
              questionType === "generated-dropdowns";
            const isHint =
              el.closest(".hint-wrapper") ||
              el.classList.contains("hint") ||
              el.classList.contains("hint-word");

            let key;
            let correct = "";
            let hintData = null;

            if (isDropdown) {
              const dIdx = dropdownIndex++;
              key = `dropdown_${dIdx}`;
              correct =
                correctAnswer?.[key] ??
                question?.dropdowns?.[dIdx]?.correctAnswer ??
                question?.dropdowns?.[dIdx]?.correct_answer ??
                "";
            } else if (isHint) {
              const hIdx = hintIndex++;
              key = `hint_${hIdx}`;
              const hw = question?.hintWords?.[hIdx];
              correct = correctAnswer?.[key] ?? hw?.word ?? "";
              hintData = el.dataset?.hint || hw?.hint || null;
            } else {
              const gIdx = gapIndex++;
              key = `gap_${gIdx}`;
              const gapItem = question?.gaps?.[gIdx];
              correct =
                correctAnswer?.[key] ??
                gapItem?.correctAnswers?.[0] ??
                gapItem?.correct_answers?.[0] ??
                "";
            }

            let currentValue = "";
            if (showCorrectAnswer && frozenAnswers?.[key] !== undefined) {
              currentValue = frozenAnswers[key];
            } else {
              currentValue = answers?.[key] ?? "";
            }

            const isIncorrect =
              showCorrectAnswer && answerStatus?.[key] === false;
            const isCorrect =
              showCorrectAnswer && answerStatus?.[key] === true;

            // 1. RENDER DROPDOWN
            if (isDropdown) {
              let options = [];
              if (el.dataset?.options) {
                try {
                  const decoded = decodeHtmlEntities(el.dataset.options);
                  options = JSON.parse(decoded);
                } catch {
                  options = [];
                }
              }

              if (
                (!options || options.length === 0) &&
                question?.dropdowns?.[dropdownIndex - 1]?.options
              ) {
                options = question.dropdowns[dropdownIndex - 1].options;
              }

              if (!shuffledOptionsMap[key] && Array.isArray(options)) {
                const shuffled =
                  editable && !showCorrectAnswer
                    ? shuffleArray(options)
                    : [...options];
                setShuffledOptionsMap((prev) => ({ ...prev, [key]: shuffled }));
                options = shuffled;
              } else if (shuffledOptionsMap[key]) {
                options = shuffledOptionsMap[key];
              }

              children.push(
                <span
                  key={`cloze-dropdown-${key}-${nodeKey}`}
                  style={{ display: "inline-block", position: "relative" }}
                >
                  <select
                    className={`gap-dropdown form-select d-inline-block ${
                      isCorrect ? "correct-answer" : ""
                    } ${isIncorrect ? "incorrect-answer" : ""}`}
                    style={{
                      width: "auto",
                      minWidth: 110,
                      margin: "0 4px",
                      padding: "4px 28px 4px 10px",
                      fontSize: `${fontSize}px`,
                      borderRadius: 6,
                      border: "2px solid #d9d9d9",
                      backgroundColor: !editable ? "#f5f5f5" : "#fff",
                      cursor: !editable ? "not-allowed" : "pointer",
                      ...getStatusStyle(key),
                    }}
                    disabled={!editable}
                    value={currentValue}
                    onChange={(e) => onAnswerChange?.(key, e.target.value)}
                  >
                    <option value="" disabled hidden>
                      -- Chọn đáp án --
                    </option>
                    {(options || []).map((opt, optIdx) => (
                      <option key={optIdx} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {isIncorrect && correct && (
                    <Tooltip title="Đáp án đúng">
                      <span
                        style={{
                          marginLeft: 4,
                          color: "#52c41a",
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >
                        ✓ {correct}
                      </span>
                    </Tooltip>
                  )}
                </span>
              );
            }
            // 2. RENDER HINT
            else if (isHint) {
              children.push(
                <span
                  key={`cloze-hint-${key}-${nodeKey}`}
                  style={{ display: "inline-block", position: "relative" }}
                >
                  <Tooltip title={hintData ? `Gợi ý: ${hintData}` : undefined}>
                    <input
                      type="text"
                      className={`gap-input hint-input ${
                        isCorrect ? "correct-answer" : ""
                      } ${isIncorrect ? "incorrect-answer" : ""}`}
                      style={{
                        width: "auto",
                        minWidth: 80,
                        maxWidth: 180,
                        margin: "0 4px",
                        padding: "4px 10px",
                        fontSize: `${fontSize}px`,
                        borderRadius: 6,
                        border: hintData
                          ? "2px solid #faad14"
                          : "2px solid #d9d9d9",
                        backgroundColor: !editable ? "#f5f5f5" : "#fff",
                        cursor: !editable ? "not-allowed" : "text",
                        ...getStatusStyle(key),
                      }}
                      disabled={!editable}
                      value={currentValue}
                      onChange={(e) => onAnswerChange?.(key, e.target.value)}
                      placeholder={hintData ? `💡 ${hintData}` : "Điền từ..."}
                    />
                  </Tooltip>
                  {isIncorrect && correct && (
                    <Tooltip title="Đáp án đúng">
                      <span
                        style={{
                          marginLeft: 4,
                          color: "#52c41a",
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >
                        ✓ {correct}
                      </span>
                    </Tooltip>
                  )}
                </span>
              );
            }
            // 3. RENDER GAP (Tự do)
            else {
              children.push(
                <span
                  key={`cloze-gap-${key}-${nodeKey}`}
                  style={{ display: "inline-block", position: "relative" }}
                >
                  <input
                    type="text"
                    className={`gap-input ${
                      isCorrect ? "correct-answer" : ""
                    } ${isIncorrect ? "incorrect-answer" : ""}`}
                    style={{
                      width: "auto",
                      minWidth: 70,
                      maxWidth: 160,
                      margin: "0 4px",
                      padding: "4px 10px",
                      fontSize: `${fontSize}px`,
                      borderRadius: 6,
                      border: "2px solid #d9d9d9",
                      backgroundColor: !editable ? "#f5f5f5" : "#fff",
                      cursor: !editable ? "not-allowed" : "text",
                      ...getStatusStyle(key),
                    }}
                    disabled={!editable}
                    value={currentValue}
                    onChange={(e) => onAnswerChange?.(key, e.target.value)}
                    placeholder="..."
                  />
                  {isIncorrect && correct && (
                    <Tooltip title="Đáp án đúng">
                      <span
                        style={{
                          marginLeft: 4,
                          color: "#52c41a",
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >
                        ✓ {correct}
                      </span>
                    </Tooltip>
                  )}
                </span>
              );
            }
          } else if (isVoidTag) {
            children.push(
              React.createElement(tagName, {
                key: `${tagName}-${nodeKey}`,
                style: elemStyle,
                className: el.className || undefined,
              })
            );
          } else {
            children.push(
              React.createElement(
                tagName,
                {
                  key: `${tagName}-${nodeKey}`,
                  style: elemStyle,
                  className: el.className || undefined,
                },
                walkNodes(el, nodeKey)
              )
            );
          }
        }
      });

      return children;
    };

    return walkNodes(container);
  };

  return (
    <div
      className={className}
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: 1.8,
        ...style,
      }}
    >
      {parseAndRender()}
    </div>
  );
};

export default ClozeTextRenderer;
