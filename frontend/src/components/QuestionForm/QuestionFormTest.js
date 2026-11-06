import React, { useState, useEffect } from "react";
import Axios from "axios";
import RichTextEditor from "../Editor/RichTextEditor";
import ReadingTaskEditor from "../Editor/ReadingTaskEditor";
import EditorSection from "../Editor/EditorSection";
import ExplanationEditor from "../Explanation/ExplanationEditor";
import QuestionType from "../QuestionType";
import CheckboxesEditor from "../Editor/CheckboxEditor";
import MultipleChoiceEditor from "../Editor/MultipleChoiceEditor";
import config from "../../config";

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */

const Badge = ({ className = "", children }) => (
  <span
    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 " +
  "placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

const QuestionFormTest = ({
  questionIndex = 0,
  questionData = {},
  onAddQuestion,
  quizId,
  onDelete,
  onFinishEdit,
  onFocusQuestion,
}) => {
  const [questionType, setQuestionType] = useState("");
  const [gaps, setGaps] = useState([]);
  const [dropdowns, setDropdowns] = useState([]);
  const [options, setOptions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [readingContent, setReadingContent] = useState("");
  const [explanation, setExplanation] = useState("");
  const [points, setPoints] = useState(0);
  const [hintWords, setHintWords] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [questionId, setQuestionId] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const hasOptions =
    questionType === "checkboxes" || questionType === "multiple-choice";

  /* ----------------------------- Effects ----------------------------- */

  useEffect(() => {
    const fetchQuestion = async () => {
      if (
        questionData.id &&
        (!questionData.questionText || !questionData.questionType)
      ) {
        try {
          const res = await Axios.get(
            `${config.API_URL}/api/questions/${questionData.id}`,
          );
          setFromData(res.data);
        } catch (err) {
          console.error("❌ Error fetching question:", err);
        }
      } else {
        setFromData(questionData);
      }
    };
    fetchQuestion();
  }, [questionData]);

  const setFromData = (data) => {
    setQuestionId(data.id || "");
    setQuestionType(data.questionType || data.question_type || "");
    setGaps(data.gaps || []);
    setDropdowns(data.dropdowns || []);
    setOptions(data.options || []);
    setQuestionText(data.questionText || data.question_text || "");
    setReadingContent(data.readingContent || data.reading_content || "");
    setExplanation(data.explanation || "");
    setPoints(data.points || 0);
    setHintWords(data.hintWords || data.hint_words || []);
  };

  /* ----------------------------- Handlers ---------------------------- */

  const handleFocus = () => {
    if (points === 0) setPoints("");
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (points === "") setPoints(0);
    setIsFocused(false);
  };

  const handleEditorFocus = () => {
    onFocusQuestion?.(questionId);
  };

  const handleCreateGap = (selectedText, startPosition) => {
    const newGap = {
      correct_answers: [selectedText],
      position: startPosition,
      length: selectedText.length,
    };
    setGaps((prev) => [...prev, newGap]);
  };

  const handleCreateMultipleGap = (selectedText, startPosition) => {
    const answers = selectedText
      .split("#")
      .map((ans) => ans.trim())
      .filter(Boolean);

    if (answers.length < 2) {
      alert("Multiple gap must contain at least 2 answers, separated by #");
      return;
    }

    const newGap = {
      correct_answers: answers,
      position: startPosition,
      length: selectedText.length,
    };
    setGaps((prev) => [...prev, newGap]);
  };

  const handleDeleteGap = (deletedText) => {
    setGaps((prevGaps) => {
      const newGaps = prevGaps.filter(
        (gap) => !gap.correct_answers.includes(deletedText),
      );
      console.log("🔁 Gaps after deletion:", newGaps);
      return newGaps;
    });
  };

  const handleAddHint = (word, hint) => {
    setHintWords((prev) => [...prev, { word, hint }]);
  };

  const handleCreateDropdown = (dropdownData) => {
    setDropdowns((prev) => [...prev, dropdownData]);
  };

  const buildPayload = () => ({
    questionType,
    readingContent,
    questionText,
    explanation,
    points,
    gaps,
    dropdowns,
    hintWords,
    quiz_id: quizId,
    ...(hasOptions ? { options } : {}),
  });

  const handleCreateQuestion = async () => {
    try {
      const response = await Axios.post(
        `${config.API_URL}/api/questions`,
        buildPayload(),
      );
      alert("✅ Question created successfully");
      setQuestionId(response.data.id);
    } catch (error) {
      console.error("❌ Failed to create question:", error);
      alert("❌ Failed to create question.");
    }
  };

  const handleUpdateQuestion = async () => {
    const updatedData = buildPayload();
    console.log("📤 Updating question with:", updatedData);

    try {
      await Axios.put(
        `${config.API_URL}/api/questions/${questionId}`,
        updatedData,
      );
      alert("✅ Question updated successfully");
      onFinishEdit?.({ ...updatedData, id: questionId });
    } catch (error) {
      console.error("❌ Failed to update question:", error);
      alert("❌ Update failed.");
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      onDelete?.(questionIndex, questionId);
    }
  };

  /* ------------------------------ Render ----------------------------- */

  return (
    <div className="mb-8">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-expanded={!isCollapsed}
              aria-label={isCollapsed ? "Expand question" : "Collapse question"}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-slate-300 bg-white text-xs text-slate-600 transition-colors hover:bg-slate-100"
            >
              {isCollapsed ? "▶" : "▼"}
            </button>

            <h5 className="m-0 flex flex-wrap items-center gap-2 text-lg font-semibold text-slate-900">
              <span>Question {questionIndex + 1}</span>
              {questionId && (
                <Badge className="bg-emerald-50 text-emerald-700">Saved</Badge>
              )}
              {questionType && (
                <Badge className="bg-blue-50 capitalize text-blue-700">
                  {questionType}
                </Badge>
              )}
            </h5>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="cursor-pointer rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-600 hover:text-white"
          >
            Delete
          </button>
        </div>

        {/* Body */}
        {!isCollapsed && (
          <div className="space-y-5 bg-slate-50 px-5 py-6">
            {/* Settings */}
            <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row">
              <div className="flex flex-1 flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Question type
                </label>
                <QuestionType
                  questionType={questionType}
                  setQuestionType={setQuestionType}
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:w-40">
                <label
                  htmlFor="points"
                  className="text-sm font-medium text-slate-700"
                >
                  Points per gap
                </label>
                <input
                  type="number"
                  id="points"
                  className={inputClass}
                  value={isFocused ? points : points === 0 ? "" : points}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={(e) => setPoints(Number(e.target.value))}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Question content */}
            {questionType === "reading" ? (
              <ReadingTaskEditor
                readingContent={readingContent}
                setReadingContent={setReadingContent}
                questionText={questionText}
                setQuestionText={setQuestionText}
                onCreateGap={handleCreateGap}
                onCreateDropdown={handleCreateDropdown}
                onFocus={handleEditorFocus}
              />
            ) : (
              <>
                <EditorSection label="Question text">
                  <RichTextEditor
                    key={questionData?.id || "new"}
                    value={questionText}
                    onChange={setQuestionText}
                    onDeleteGap={handleDeleteGap}
                    onCreateMultipleGap={handleCreateMultipleGap}
                    onCreateGap={handleCreateGap}
                    onAddHint={handleAddHint}
                    onCreateDropdown={handleCreateDropdown}
                    onFocus={handleEditorFocus}
                  />
                </EditorSection>

                {questionType === "multiple-choice" && (
                  <EditorSection label="Answer options">
                    <MultipleChoiceEditor
                      questionText={questionText}
                      setQuestionText={setQuestionText}
                      options={options}
                      setOptions={setOptions}
                    />
                  </EditorSection>
                )}

                {questionType === "checkboxes" && (
                  <EditorSection label="Checkbox options">
                    <CheckboxesEditor
                      options={options}
                      setOptions={setOptions}
                    />
                  </EditorSection>
                )}
              </>
            )}

            {/* Explanation */}
            <EditorSection label="Explanation (optional)">
              <ExplanationEditor
                value={explanation}
                onChange={setExplanation}
              />
            </EditorSection>

            {/* Actions */}
            <div className="flex justify-center border-t border-dashed border-slate-300 pt-5">
              {!questionId ? (
                <button
                  type="button"
                  onClick={handleCreateQuestion}
                  className="w-full cursor-pointer rounded-lg bg-emerald-600 px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 sm:w-auto sm:min-w-[200px]"
                >
                  Save question
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleUpdateQuestion}
                  className="w-full cursor-pointer rounded-lg bg-amber-500 px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 sm:w-auto sm:min-w-[200px]"
                >
                  Update question
                </button>
              )}
            </div>

            {/* Stats */}
            {(gaps.length > 0 ||
              dropdowns.length > 0 ||
              hintWords.length > 0) && (
              <div className="flex flex-wrap justify-center gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                {dropdowns.length > 0 && (
                  <span>Dropdowns: {dropdowns.length}</span>
                )}
                {hintWords.length > 0 && <span>Hints: {hintWords.length}</span>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionFormTest;
