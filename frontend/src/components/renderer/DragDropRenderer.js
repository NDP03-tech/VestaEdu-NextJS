import React, { useEffect, useRef, useState } from "react";
import { Tooltip } from "antd";
import {
  DragOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import "./DragDropRichRenderer.css";

/* ------------------------------------------------------------------ */
/* Pure helpers                                                        */
/* ------------------------------------------------------------------ */

const decodeHtmlEntities = (str) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
};

const shuffleArray = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

// Chuẩn hóa key của initialAnswer: "0" -> "gap_0"
const normalizeInitialAnswer = (initial) => {
  const normalized = {};
  if (!initial || typeof initial !== "object") return normalized;

  Object.keys(initial).forEach((k) => {
    if (/^(gap_|dropdown_|hint_)/.test(k)) normalized[k] = initial[k];
    else if (/^\d+$/.test(k)) normalized[`gap_${k}`] = initial[k];
    else normalized[k] = initial[k];
  });
  return normalized;
};

const getClozeType = (el) => {
  if (el.classList.contains("dropdown")) return "dropdown";
  const isHint =
    el.closest(".hint-wrapper") ||
    el.classList.contains("hint") ||
    el.classList.contains("hint-word");
  return isHint ? "hint" : "gap";
};

/* ------------------------------------------------------------------ */
/* Class builders (chuỗi class phải viết đầy đủ để Tailwind quét được)  */
/* ------------------------------------------------------------------ */

const FIELD_BASE =
  "mx-1 w-auto rounded-md border-2 text-sm text-slate-900 transition-colors";

const fieldClasses = ({ editable, status }) => {
  let state;
  if (status === undefined) {
    state = editable
      ? "border-slate-300 bg-white hover:border-blue-400"
      : "border-slate-300 bg-slate-100";
  } else {
    state = status
      ? "border-emerald-500 bg-emerald-50"
      : "border-red-500 bg-red-50";
  }
  const interaction = editable
    ? "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
    : "cursor-not-allowed";
  return `${FIELD_BASE} ${state} ${interaction}`;
};

const GAP_BASE =
  "drag-drop-gap group relative mx-1.5 inline-flex min-h-[36px] min-w-[80px] select-none items-center justify-center rounded-lg border-2 px-2 py-1 text-[13px] font-medium transition-all duration-200 md:min-w-[100px] md:px-3 md:py-1.5 md:text-sm";

const gapClasses = ({ value, status, editable, showCorrectAnswer }) => {
  let state;
  if (status !== undefined) {
    state = status
      ? "border-solid border-emerald-500 bg-emerald-50"
      : "border-solid border-red-500 bg-red-50";
  } else if (value) {
    state = "border-solid border-blue-300 bg-blue-50";
  } else {
    state = "border-dashed border-slate-300 bg-slate-50";
  }

  let interaction;
  if (!editable) {
    interaction = "cursor-not-allowed opacity-70";
  } else if (showCorrectAnswer) {
    interaction = "cursor-pointer hover:scale-[1.02] hover:opacity-80";
  } else if (value) {
    interaction =
      "cursor-pointer hover:scale-[1.03] hover:border-amber-400 hover:bg-amber-50 hover:shadow-sm";
  } else {
    interaction =
      "cursor-pointer hover:scale-[1.02] hover:border-blue-400 hover:bg-blue-50";
  }

  return `${GAP_BASE} ${state} ${interaction}`;
};

const gapContentClasses = ({ value, status, editable, showCorrectAnswer }) => {
  const base =
    "inline-block max-w-[200px] truncate align-bottom transition-colors";
  if (status !== undefined) {
    return `${base} font-medium ${status ? "text-emerald-600" : "text-red-600"}`;
  }
  const canHover = editable && !showCorrectAnswer;
  if (value) {
    return `${base} font-semibold text-blue-600${
      canHover ? " group-hover:text-amber-600" : ""
    }`;
  }
  return `${base} font-normal text-slate-400${
    canHover ? " group-hover:text-blue-500" : ""
  }`;
};

/* ------------------------------------------------------------------ */
/* DOM builders cho các phần tử sinh ra bên trong HTML của câu hỏi     */
/* ------------------------------------------------------------------ */

const createDropdown = (
  el,
  { value, editable, showCorrectAnswer, status, onChange },
) => {
  let options = [];
  if (el.dataset?.options) {
    try {
      options = JSON.parse(decodeHtmlEntities(el.dataset.options));
    } catch (err) {
      console.error("Dropdown parse error", err);
    }
  }

  // Chỉ xáo trộn khi đang làm bài
  if (editable && !showCorrectAnswer) {
    options = shuffleArray(options);
  }

  const select = document.createElement("select");
  select.className = `drag-drop-select min-w-[120px] py-1.5 pl-3 pr-8 ${
    editable ? "cursor-pointer" : ""
  } ${fieldClasses({ editable, status })}`;

  if (!editable) select.disabled = true;

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "-- Select an answer --";
  placeholder.disabled = true;
  placeholder.hidden = true;
  select.appendChild(placeholder);

  options.forEach((opt) => {
    const optEl = document.createElement("option");
    optEl.value = opt;
    optEl.textContent = opt;
    select.appendChild(optEl);
  });

  select.value = value ?? "";

  if (editable) {
    select.onchange = (e) => onChange(e.target.value);
  }

  el.appendChild(select);
};

const createHintInput = (el, { value, editable, status, onChange }) => {
  const input = document.createElement("input");
  input.type = "text";
  input.className = `drag-drop-input min-w-[100px] px-3 py-1.5 ${fieldClasses({
    editable,
    status,
  })}`;
  input.placeholder = editable ? "Type here..." : "";
  input.value = value ?? "";

  if (!editable) {
    input.disabled = true;
  } else {
    input.oninput = (e) => onChange(e.target.value);
  }

  el.appendChild(input);
};

const createGap = (
  el,
  { key, value, editable, showCorrectAnswer, status, onRemove, onDropAnswer },
) => {
  const state = { value, status, editable, showCorrectAnswer };

  const wrapper = document.createElement("span");
  wrapper.dataset.key = key;
  wrapper.className = gapClasses(state);

  const content = document.createElement("span");
  content.className = gapContentClasses(state);
  content.textContent = value || "Drop here";
  wrapper.appendChild(content);

  // Chế độ xem lại: hiện ✓ / ✗
  if (status !== undefined) {
    const icon = document.createElement("span");
    icon.className = `ml-1.5 text-base ${
      status ? "text-emerald-600" : "text-red-600"
    }`;
    icon.textContent = status ? "✓" : "✗";
    wrapper.appendChild(icon);
  }

  if (editable) {
    // Double-click để gỡ đáp án
    if (value) {
      wrapper.ondblclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        wrapper.style.animation = "shake 0.3s ease";
        setTimeout(() => onRemove(key), 150);
      };
      wrapper.title = "Double-click to remove";
    } else {
      wrapper.title = "Drag an answer here";
    }

    // Kéo thả
    wrapper.ondragover = (e) => {
      e.preventDefault();
      wrapper.classList.add("is-over");
    };

    wrapper.ondragleave = (e) => {
      e.preventDefault();
      wrapper.classList.remove("is-over");
    };

    wrapper.ondrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      wrapper.classList.remove("is-over");

      const text = e.dataTransfer.getData("text");
      if (!text) return;
      onDropAnswer(key, text);
    };
  }

  el.appendChild(wrapper);
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const DragDropRichRenderer = ({
  question,
  initialAnswer = {},
  onAnswerChange,
  answerStatus = {},
  showCorrectAnswer = false,
  editable = true,
}) => {
  const containerRef = useRef(null);
  const [droppedAnswers, setDroppedAnswers] = useState({});
  const [availableAnswers, setAvailableAnswers] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);

  // Khởi tạo đáp án đã điền và danh sách đáp án còn lại
  useEffect(() => {
    if (!question) return;
    const normalized = normalizeInitialAnswer(initialAnswer);
    setDroppedAnswers(normalized);

    const used = Object.values(normalized);
    const allAnswers =
      question.gaps?.flatMap((g) => g.correct_answers || []) || [];
    const unique = [...new Set(allAnswers)].filter(
      (a) => a && !used.includes(a),
    );
    setAvailableAnswers(unique);
  }, [question, initialAnswer]);

  // Render lại DOM mỗi khi đáp án thay đổi
  useEffect(() => {
    if (!question?.question_text) return;
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = question.question_text;

    const counters = { gap: 0, dropdown: 0, hint: 0 };

    container.querySelectorAll("a.cloze").forEach((el) => {
      const type = getClozeType(el);
      const key = `${type}_${counters[type]++}`;
      const value = droppedAnswers[key] ?? "";
      const status =
        showCorrectAnswer && answerStatus[key] !== undefined
          ? answerStatus[key]
          : undefined;

      el.innerHTML = "";

      const ctx = {
        key,
        value,
        status,
        editable,
        showCorrectAnswer,
        onChange: (val) => handleChange(key, val),
        onRemove: handleRemove,
        onDropAnswer: placeAnswer,
      };

      if (type === "dropdown") createDropdown(el, ctx);
      else if (type === "hint") createHintInput(el, ctx);
      else createGap(el, ctx);
    });
  }, [droppedAnswers, showCorrectAnswer, answerStatus, question, editable]);

  /* ----------------------------- Handlers ---------------------------- */

  const handleChange = (key, value) => {
    const updated = { ...droppedAnswers, [key]: value };
    setDroppedAnswers(updated);
    onAnswerChange?.(question.id, updated);
  };

  // Thả một đáp án vào gap (trả đáp án cũ về danh sách nếu có)
  const placeAnswer = (key, text) => {
    if (droppedAnswers[key] && droppedAnswers[key] !== text) {
      const oldAnswer = droppedAnswers[key];
      setAvailableAnswers((prev) => [...prev, oldAnswer]);
    }

    const updated = { ...droppedAnswers, [key]: text };
    setDroppedAnswers(updated);
    setAvailableAnswers((prev) => prev.filter((a) => a !== text));
    onAnswerChange?.(question.id, updated);
  };

  const handleRemove = (key) => {
    const removed = droppedAnswers[key];
    if (!removed) return;
    const updated = { ...droppedAnswers };
    delete updated[key];
    setDroppedAnswers(updated);
    setAvailableAnswers((prev) => [...prev, removed]);
    onAnswerChange?.(question.id, updated);
  };

  const handleDragStart = (e, text) => {
    e.dataTransfer.setData("text", text);
    e.dataTransfer.effectAllowed = "move";
    setDraggedItem(text);
  };

  const handleDragEnd = () => setDraggedItem(null);

  /* ------------------------------ Derived ---------------------------- */

  const totalGaps = question?.gaps?.length || 0;
  const filledGaps = Object.keys(droppedAnswers).filter(
    (k) => k.startsWith("gap_") && droppedAnswers[k],
  ).length;
  const progressPercent = totalGaps > 0 ? (filledGaps / totalGaps) * 100 : 0;

  const isDoing = editable && !showCorrectAnswer;

  /* ------------------------------ Render ----------------------------- */

  return (
    <div className="py-4">
      {/* Instructions */}
      {isDoing && (
        <div className="mb-4 flex gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
          <InfoCircleOutlined className="mt-0.5 text-blue-500" />
          <div className="text-sm text-slate-700">
            <p className="m-0 font-semibold text-slate-900">
              How to complete this exercise
            </p>
            <ul className="m-0 mt-1 list-disc space-y-1 pl-5">
              <li>
                <strong>Drag</strong> answer options from below into the gaps in
                the text
              </li>
              <li>
                <strong>Double-click</strong> on placed answers to remove them
              </li>
              <li>All gaps must be filled before submitting</li>
            </ul>
          </div>
        </div>
      )}

      {/* Progress */}
      {isDoing && totalGaps > 0 && (
        <div className="mb-4 flex flex-col gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-medium text-slate-700">
            Progress: {filledGaps} / {totalGaps} gaps filled
          </span>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 sm:w-48">
            <div
              className="h-full rounded-full bg-emerald-500 transition-[width] duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Available answers */}
      {editable && availableAnswers.length > 0 && (
        <div
          className={`mb-5 rounded-xl border bg-white p-4 shadow-sm ${
            showCorrectAnswer ? "border-2 border-amber-400" : "border-slate-200"
          }`}
        >
          <div className="mb-3 flex items-center gap-2">
            <DragOutlined className="text-lg text-blue-500" />
            <span className="text-[15px] font-semibold text-slate-900">
              Available answers ({availableAnswers.length})
            </span>
            {showCorrectAnswer && (
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                Review mode
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {availableAnswers.map((ans, idx) => {
              const isDragged = draggedItem === ans;
              return (
                <Tooltip
                  key={idx}
                  title={
                    showCorrectAnswer
                      ? "Drag to replace wrong answers"
                      : "Drag me to a gap"
                  }
                  placement="top"
                >
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, ans)}
                    onDragEnd={handleDragEnd}
                    className={`draggable-answer-tag cursor-grab select-none rounded-lg border-2 px-3.5 py-1.5 text-sm font-medium transition-all duration-200 active:cursor-grabbing ${
                      isDragged
                        ? "scale-105 border-blue-600 bg-blue-600 text-white shadow-md"
                        : showCorrectAnswer
                          ? "border-amber-400 bg-amber-50 text-amber-700 hover:scale-105 hover:shadow-md"
                          : "border-blue-500 bg-blue-50 text-blue-600 hover:scale-105 hover:shadow-md"
                    }`}
                  >
                    {ans}
                  </div>
                </Tooltip>
              );
            })}
          </div>

          {showCorrectAnswer && (
            <p className="mb-0 mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
              <strong>Tip:</strong> Double-click on wrong answers (red) to
              remove them, then drag the correct answer from here.
            </p>
          )}
        </div>
      )}

      {/* Question content */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div
          ref={containerRef}
          className="drag-drop-content text-base text-slate-800"
        />
      </div>

      {/* Results summary */}
      {showCorrectAnswer && (
        <div className="mt-4 flex flex-wrap gap-6 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircleOutlined className="text-2xl text-emerald-500" />
            <span className="text-base font-semibold text-slate-900">
              {Object.values(answerStatus).filter(Boolean).length} Correct
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CloseCircleOutlined className="text-2xl text-red-500" />
            <span className="text-base font-semibold text-slate-900">
              {Object.values(answerStatus).filter((v) => v === false).length}{" "}
              Incorrect
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DragDropRichRenderer;
