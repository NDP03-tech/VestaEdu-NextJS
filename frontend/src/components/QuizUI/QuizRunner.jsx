import React, { useState, useEffect, useMemo } from "react";
import QuestionRenderer from "../QuestionRenderer";
import { Button } from "../ui/Button";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { Badge } from "../ui/Badge";

const QuizRunner = ({
  questions = [],
  headerText,
  onePerPage,
  onAnswerChange,
  correctAnswers = [],
  onSubmit,
  showCorrectAnswer,
  timeLimit,
  hasSubmitted,
  scoreAfterSubmit,
  initialAnswers = {},
  uiSettings = {},
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(
    timeLimit ? timeLimit * 60 : 0
  );
  const [frozenAnswers, setFrozenAnswers] = useState(null);
  const showQuestionNumbers = uiSettings.showQuestionNumbers ?? true;

  useEffect(() => {
    setCurrentIndex(0);
    setSecondsLeft(timeLimit ? timeLimit * 60 : 0);
    setFrozenAnswers(null);
  }, [questions, timeLimit]);

  useEffect(() => {
    if (!timeLimit) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLimit, onSubmit]);

  const normalizedAnswers = useMemo(() => {
    if (Array.isArray(initialAnswers)) {
      return initialAnswers.reduce((acc, curr) => {
        acc[curr.question] = curr.answer;
        return acc;
      }, {});
    }
    return initialAnswers;
  }, [initialAnswers]);

  useEffect(() => {
    if (hasSubmitted && !frozenAnswers) {
      setFrozenAnswers({ ...normalizedAnswers });
    }
  }, [hasSubmitted, frozenAnswers, normalizedAnswers]);

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const isLowTime = timeLimit && secondsLeft <= 60;

  const buildPrefilledAnswers = (question) => {
    const result = {};
    let index = 0;

    const items = [
      ...(question.gaps?.map((g) => ({ ...g, type: "gap" })) || []),
      ...(question.hintWords?.map((h) => ({ ...h, type: "hint" })) || []),
      ...(question.dropdowns?.map((d) => ({ ...d, type: "dropdown" })) || []),
    ].sort((a, b) => a.position - b.position);

    items.forEach((item) => {
      if (item.type === "gap")
        result[`gap_${index}`] = item.correct_answers?.[0] || "";
      else if (item.type === "hint") result[`gap_${index}`] = item.word || "";
      else if (item.type === "dropdown")
        result[`gap_${index}`] = item.correct_answer || "";
      index++;
    });

    return result;
  };

  const getInitialAnswerForQuestion = (question) => {
    const answer = normalizedAnswers[question.id];
    const type = question.questionType || question.question_type;

    if (questions?.visibleTo === "everyone_record") {
      return buildPrefilledAnswers(question);
    }

    switch (type) {
      case "checkboxes":
        if (Array.isArray(answer)) return answer;
        if (typeof answer === "string") {
          try {
            const parsed = JSON.parse(answer);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        }
        return [];
      case "find-highlight":
        return Array.isArray(answer) ? answer : [];
      case "blank-boxes":
      case "generated-dropdowns":
      case "drag-drop-matching":
        return typeof answer === "object" && answer !== null ? answer : {};
      case "multiple-choice":
      case "essay":
      case "reading":
      case "speaking":
        return typeof answer === "string" ? answer : "";
      default:
        return answer;
    }
  };

  const shouldShowOnePerPage = onePerPage && questions.length > 1;

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* ── Sticky Top Bar: Title & Timer ── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          <div className="flex-1 truncate">
            {headerText ? (
              <h1
                className="text-base sm:text-lg font-bold text-slate-800 truncate"
                dangerouslySetInnerHTML={{ __html: headerText }}
              />
            ) : (
              <span className="text-base font-bold text-slate-800">Bài kiểm tra</span>
            )}
          </div>

          {/* Time Remaining Badge */}
          {timeLimit > 0 && (
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                isLowTime
                  ? "bg-red-50 text-red-600 border border-red-200 animate-pulse"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeWidth="2" strokeLinecap="round" d="M12 6v6l4 2" />
              </svg>
              <span>{formatTime(secondsLeft)}</span>
            </div>
          )}
        </div>

        {/* Progress Bar for One-Per-Page */}
        {shouldShowOnePerPage && (
          <div className="w-full bg-slate-100 h-1">
            <div
              className="bg-blue-600 h-1 transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        )}
      </header>

      {/* ── Main Quiz Container ── */}
      <main className="max-w-4xl mx-auto px-4 mt-6">
        {/* Score banner after submitted */}
        {hasSubmitted && (
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <h4 className="font-bold text-base leading-snug">Kết quả làm bài</h4>
                <p className="text-xs text-emerald-100">Bạn có thể xem lại chi tiết đáp án bên dưới</p>
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black bg-white/20 px-4 py-1.5 rounded-xl backdrop-blur-xs">
              {scoreAfterSubmit}%
            </div>
          </div>
        )}

        {shouldShowOnePerPage ? (
          /* One question per page mode */
          <div className="space-y-6">
            <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden bg-white">
              {showQuestionNumbers && (
                <CardHeader className="bg-slate-50/50 py-3.5 px-6 flex items-center justify-between border-b border-slate-100">
                  <Badge variant="primary" size="md">
                    Câu hỏi {currentIndex + 1} / {questions.length}
                  </Badge>
                </CardHeader>
              )}
              <CardBody className="p-6 sm:p-8">
                <QuestionRenderer
                  key={questions[currentIndex]?.id}
                  question={questions[currentIndex]}
                  showCorrectAnswer={showCorrectAnswer || hasSubmitted}
                  hasSubmitted={hasSubmitted}
                  frozenAnswer={frozenAnswers?.[questions[currentIndex]?.id]}
                  correctAnswers={correctAnswers}
                  initialAnswer={getInitialAnswerForQuestion(
                    questions[currentIndex]
                  )}
                  onAnswerChange={(questionId, answer) =>
                    onAnswerChange(questionId, answer)
                  }
                  editable={questions?.visibleTo !== "everyone_record"}
                />
              </CardBody>
            </Card>

            {/* Stepper Navigation */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="gap-2 px-5 rounded-xl"
              >
                ← Câu trước
              </Button>

              {currentIndex < questions.length - 1 ? (
                <Button
                  variant="primary"
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      Math.min(questions.length - 1, prev + 1)
                    )
                  }
                  className="gap-2 px-6 rounded-xl shadow-md shadow-blue-500/20"
                >
                  Câu tiếp theo →
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={onSubmit}
                  className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 px-7 rounded-xl shadow-md shadow-emerald-600/20"
                >
                  ✅ Nộp bài
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* All questions in one scrollable page */
          <div className="space-y-6">
            {questions.map((q, index) => (
              <Card
                key={q.id || index}
                className="rounded-2xl border-slate-200 shadow-sm overflow-hidden bg-white"
              >
                {showQuestionNumbers && (
                  <CardHeader className="bg-slate-50/50 py-3.5 px-6 border-b border-slate-100">
                    <Badge variant="primary" size="md">
                      Câu hỏi {index + 1}
                    </Badge>
                  </CardHeader>
                )}
                <CardBody className="p-6 sm:p-8">
                  <QuestionRenderer
                    question={q}
                    showCorrectAnswer={hasSubmitted}
                    hasSubmitted={hasSubmitted}
                    frozenAnswer={frozenAnswers?.[q.id]}
                    correctAnswers={correctAnswers}
                    initialAnswer={getInitialAnswerForQuestion(q)}
                    onAnswerChange={(questionId, answer) =>
                      onAnswerChange(questionId, answer)
                    }
                  />
                </CardBody>
              </Card>
            ))}

            {/* Bottom Submit Action */}
            <div className="pt-6 flex justify-center">
              <Button
                size="lg"
                onClick={onSubmit}
                className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 px-10 py-3.5 rounded-xl shadow-lg shadow-emerald-600/25 text-base font-semibold"
              >
                ✅ Nộp bài thi
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizRunner;
