import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuizInfo from "./QuizInfo/QuizInfo";
import QuestionFormTest from "./QuestionForm/QuestionFormTest";
import config from "../config";

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */

const Spinner = ({ className = "h-4 w-4" }) => (
  <span
    className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    aria-hidden="true"
  />
);

const Badge = ({ className, children }) => (
  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
    {children}
  </span>
);

const buttonBase =
  "inline-flex min-w-[96px] cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-70";

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const QuizBuilder = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quizInfo, setQuizInfo] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [focusedQuestionId, setFocusedQuestionId] = useState(null);

  const savedCount = questions.filter((q) => q.id).length;

  /* ----------------------------- Effects ----------------------------- */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizRes = await fetch(`${config.API_URL}/api/quizzes/${quizId}`);
        if (!quizRes.ok) throw new Error("Quiz not found.");
        const quizData = await quizRes.json();
        setQuizInfo(quizData);

        const questionRes = await fetch(
          `${config.API_URL}/api/questions/by-quiz/${quizId}`,
        );
        if (!questionRes.ok) throw new Error("Failed to fetch questions.");
        const questionsData = await questionRes.json();
        setQuestions(questionsData);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        alert("Failed to load quiz data.");
        navigate("/quiz-manage");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quizId, navigate]);

  /* ----------------------------- Handlers ---------------------------- */

  const handleSaveQuizInfo = async () => {
    setSaving(true);
    try {
      const quizRes = await fetch(`${config.API_URL}/api/quizzes/${quizId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizInfo),
      });

      if (!quizRes.ok) throw new Error("Failed to update quiz.");
      const updatedQuiz = await quizRes.json();
      setQuizInfo(updatedQuiz);

      // Lọc bỏ các câu hỏi rỗng hoặc trùng lặp
      const filteredQuestions = questions.filter((q) => {
        const keys = Object.keys(q);
        if (keys.length <= 1 && q.quiz_id) return false;
        if (!q.question_text && !q.questionText) return false;
        return true;
      });

      // Loại bỏ trùng lặp theo nội dung câu hỏi
      const uniqueQuestions = [];
      const seenTexts = new Set();
      for (const q of filteredQuestions) {
        const text = q.question_text || q.questionText;
        if (!seenTexts.has(text)) {
          uniqueQuestions.push(q);
          seenTexts.add(text);
        }
      }

      const updatedQuestions = await Promise.all(
        uniqueQuestions.map(async (q) => {
          const questionData = {
            ...q,
            quiz_id: quizId,
          };

          if (q.id) {
            const res = await fetch(`${config.API_URL}/api/questions/${q.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(questionData),
            });
            if (!res.ok) throw new Error("Failed to update question.");
            return await res.json();
          } else {
            const res = await fetch(`${config.API_URL}/api/questions`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(questionData),
            });
            if (!res.ok) throw new Error("Failed to create question.");
            return await res.json();
          }
        }),
      );

      setQuestions(updatedQuestions);
      alert("🎉 Quiz and questions saved successfully.");
    } catch (err) {
      console.error("❌ Error saving quiz and questions:", err);
      alert("Failed to save quiz and questions.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuestion = (newQuestion) => {
    if (Object.keys(newQuestion).length === 0) {
      setQuestions((prev) => [...prev, { quiz_id: quizId }]);
    } else {
      setQuestions((prev) => [...prev, newQuestion]);
    }
    // Cuộn xuống cuối sau khi thêm
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  const handleDeleteQuestion = async (index, questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;

    try {
      if (questionId) {
        const res = await fetch(
          `${config.API_URL}/api/questions/${questionId}`,
          { method: "DELETE" },
        );

        if (!res.ok) throw new Error("Failed to delete question.");
      }

      const updated = [...questions];
      updated.splice(index, 1);
      setQuestions(updated);
    } catch (err) {
      console.error("❌ Error deleting question:", err);
      alert("Failed to delete question.");
    }
  };

  const handleFinishEdit = (updatedQuestion) => {
    setQuestions((prev) => {
      const index = prev.findIndex((q) => q.id === updatedQuestion.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = updatedQuestion;
        return updated;
      }

      const emptyIndex = prev.findIndex((q) => !q.id);
      if (emptyIndex !== -1) {
        const updated = [...prev];
        updated[emptyIndex] = updatedQuestion;
        return updated;
      }

      return [...prev, updatedQuestion];
    });
  };

  const handleFocusQuestion = (questionId) => {
    setFocusedQuestionId(questionId);
  };

  /* ------------------------------ Render ----------------------------- */

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 text-slate-600">
        <Spinner className="h-8 w-8 text-blue-600" />
        <p className="m-0 text-base font-medium">Loading quiz data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-28 sm:pb-24">
      {/* Header */}
      <header className="sticky top-0 z-[1000] border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-8">
          <button
            type="button"
            onClick={() => navigate("/quiz-manage")}
            className="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
          >
            ← Back to quiz list
          </button>
          <h2 className="m-0 text-2xl font-semibold tracking-tight text-slate-900">
            Quiz builder
          </h2>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-8 sm:py-8">
        {/* Quiz info */}
        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <QuizInfo
            quizId={quizId}
            quizInfo={quizInfo}
            onQuizInfoChange={setQuizInfo}
          />
        </section>

        {/* Questions */}
        <section>
          <div className="mb-5 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <h4 className="m-0 text-xl font-semibold text-slate-900">
              Questions ({questions.length})
            </h4>
          </div>

          {questions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center">
              <h5 className="m-0 mb-2 text-xl font-semibold text-slate-900">
                No questions yet
              </h5>
              <p className="m-0 text-base text-slate-500">
                Click the "Add question" button below to create your first
                question.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {questions.map((question, index) => (
                <div
                  key={question.id || index}
                  className={`rounded-xl transition-shadow duration-200 ${
                    focusedQuestionId === question.id
                      ? "ring-4 ring-blue-500/30"
                      : ""
                  }`}
                >
                  <QuestionFormTest
                    questionIndex={index}
                    questionData={question}
                    quizId={quizId}
                    onAddQuestion={handleAddQuestion}
                    onDelete={handleDeleteQuestion}
                    onFinishEdit={handleFinishEdit}
                    onFocusQuestion={handleFocusQuestion}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Action bar */}
      <div className="fixed inset-x-0 bottom-0 z-[1000] border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-3 px-4 py-3 sm:flex-row sm:justify-between sm:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge className="bg-blue-50 text-blue-700">
              {questions.length}{" "}
              {questions.length === 1 ? "Question" : "Questions"}
            </Badge>
            {savedCount > 0 && (
              <Badge className="bg-emerald-50 text-emerald-700">
                {savedCount} Saved
              </Badge>
            )}
          </div>

          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:gap-3">
            <button
              type="button"
              onClick={() => handleAddQuestion({})}
              className={`${buttonBase} bg-blue-600 text-white hover:bg-blue-700`}
            >
              + Add question
            </button>

            <button
              type="button"
              onClick={() => navigate("/quiz-manage")}
              className={`${buttonBase} border border-slate-300 bg-white text-slate-700 hover:bg-slate-100`}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => navigate(`/user/do-quiz/${quizId}`)}
              className={`${buttonBase} border border-blue-200 bg-white text-blue-700 hover:bg-blue-50`}
            >
              Preview quiz
            </button>

            <button
              type="button"
              onClick={handleSaveQuizInfo}
              disabled={saving}
              className={`${buttonBase} bg-emerald-600 text-white hover:bg-emerald-700`}
            >
              {saving ? (
                <>
                  <Spinner />
                  Saving...
                </>
              ) : (
                "Save quiz"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizBuilder;
