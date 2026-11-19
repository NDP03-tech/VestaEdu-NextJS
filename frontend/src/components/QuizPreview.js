import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import quizService from "../services/quizService";
import questionService from "../services/questionService";
import config from "../config";

import QuizStartScreen from "../components/QuizUI/QuizStartScreen";
import QuizRunner from "../components/QuizUI/QuizRunner";
import QuizSubmitScreen from "../components/QuizUI/QuizSubmitScreen";
import { createAttemptAutosave } from "../services/attemptAutosave";

const QuizPreviewWrapper = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [autosaveStatus, setAutosaveStatus] = useState("idle");
  const autosaver = useRef(null);
  if (!autosaver.current) {
    autosaver.current = createAttemptAutosave({
      save: async ({ resultId, answers, state }) => {
        const response = await fetch(
          `${config.API_URL}/api/results/temp/${resultId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ answers, state }),
          },
        );
        if (!response.ok) {
          throw new Error(`Autosave failed with HTTP ${response.status}`);
        }
      },
      onStatus: setAutosaveStatus,
      onError: (err) => console.error("❌ Lỗi khi lưu tạm:", err),
    });
  }
  const navigate = useNavigate();

  useEffect(() => {
    autosaver.current.cancelPending();
    setQuiz(null);
    setQuestions([]);
    setAnswers({});
    setHasStarted(false);
    setHasSubmitted(false);
    setResult(null);

    const fetchData = async () => {
      try {
        const [fetchedQuiz, fetchedQuestions] = await Promise.all([
          quizService.getQuizById(quizId),
          questionService.getQuestionsByQuizId(quizId),
        ]);

        setQuiz(fetchedQuiz);
        setQuestions(fetchedQuestions);

        const token = localStorage.getItem("token");
        const res = await fetch(`${config.API_URL}/api/results/latest/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`Failed to load latest attempt: HTTP ${res.status}`);
        }
        const body = await res.json();
        const data = Object.prototype.hasOwnProperty.call(body ?? {}, "data")
          ? body.data
          : body;

        if (data?.answers && !data?.submittedAt) {
          console.log("✅ Resume from previous attempt");
          setAnswers(
            data.answers.reduce((acc, answer) => {
              acc[answer.questionId] = answer.answer;
              return acc;
            }, {}),
          );
          setResult(data);
        } else if (data?.submittedAt && data.passed) {
          alert("Bạn đã hoàn thành bài này và đạt yêu cầu. Không thể làm lại.");
          navigate("/user");
        } else if (data?.submittedAt) {
          setResult(data);
          setHasSubmitted(true);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu:", err);
      }
    };

    fetchData();
    return () => autosaver.current.cancelPending();
  }, [quizId, navigate]);

  const handleStart = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${config.API_URL}/api/results/start/${quizId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`Failed to start attempt: HTTP ${res.status}`);
      }
      const body = await res.json();
      const data = body?.data ?? body;
      console.log("📥 [RECEIVE] Start attempt:", data);
      setResult(data);
      setHasStarted(true);
    } catch (err) {
      console.error("❌ Lỗi khi bắt đầu làm bài:", err);
    }
  };

  const handleAnswerChange = (questionId, userAnswer, attemptState) => {
    const newAnswers = { ...answers, [questionId]: userAnswer };
    setAnswers(newAnswers);

    const validQuestionIds = questions.map(q => q.id);
    const answersArray = Object.entries(newAnswers)
      .filter(([qid]) => validQuestionIds.includes(Number(qid)))
      .map(([qid, ans]) => ({
        questionId: Number(qid),
        answer: ans,
        type: questions.find(q => q.id === Number(qid))?.question_type || "unknown",
      }));

    if (result?.id && !result?.submittedAt) {
      autosaver.current.schedule({
        resultId: result.id,
        answers: answersArray,
        state: attemptState,
      });
    }
  };

  const handleAttemptStateChange = (state) => {
    if (!result?.id || result?.submittedAt) return;

    const validQuestionIds = questions.map((question) => question.id);
    const answersArray = Object.entries(answers)
      .filter(([questionId]) =>
        validQuestionIds.includes(Number(questionId)),
      )
      .map(([questionId, answer]) => ({
        questionId: Number(questionId),
        answer,
        type:
          questions.find((question) => question.id === Number(questionId))
            ?.question_type || "unknown",
      }));

    autosaver.current.schedule({
      resultId: result.id,
      answers: answersArray,
      state,
    });
  };

  const handleSubmit = async () => {
    autosaver.current.cancelPending();
    await autosaver.current.waitForIdle();
    const validQuestionIds = questions.map(q => q.id);
    const answersArray = Object.entries(answers)
      .filter(([qid]) => validQuestionIds.includes(Number(qid)))
      .map(([qid, ans]) => ({
        questionId: Number(qid),
        answer: ans,
        type: questions.find(q => q.id === Number(qid))?.question_type || "unknown",
      }));

    try {
      let currentResult = result;
      if (!currentResult?.id) {
        const startRes = await fetch(
          `${config.API_URL}/api/results/start/${quizId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (!startRes.ok) {
          throw new Error(`Failed to start attempt: HTTP ${startRes.status}`);
        }
        const startBody = await startRes.json();
        currentResult = startBody?.data ?? startBody;
        if (!currentResult?.id) {
          throw new Error("Start attempt returned no result id");
        }
        setResult(currentResult);
      }

      const res = await fetch(`${config.API_URL}/api/results/submit/${currentResult.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ answers: answersArray }),
      });

      if (!res.ok) {
        throw new Error(`Submit failed with HTTP ${res.status}`);
      }
      const body = await res.json();
      const resultData = body?.data?.result ?? body?.data ?? body;
      setResult(resultData);
      setHasSubmitted(true);

      if (resultData.passed) {
        navigate("/user");
      }
    } catch (err) {
      console.error("❌ Lỗi khi nộp bài:", err);
      alert(err.message || "Không thể nộp bài. Vui lòng thử lại.");
    }
  };

  if (!quiz) return <div className="text-center mt-10">⏳ Đang tải quiz...</div>;

  const ui = quiz.uiSettings || {};
  const showInstructions = ui.showInstructionInput && ui.instructionText;

  if (showInstructions && !hasStarted && !hasSubmitted && !result) {
    return (
      <QuizStartScreen
        instruction={ui.instructionText}
        onStart={handleStart}
        timeLimit={ui.timeLimit}
      />
    );
  }

  if (hasSubmitted) {
    return (
      <QuizSubmitScreen
        message={
          result?.passed
            ? ui.quizCompleteMessage || "🎉 Bạn đã hoàn thành và vượt qua bài quiz!"
            : "🚫 Bạn chưa đạt yêu cầu. Hãy thử lại!"
        }
        score={ui.displayScore ? result?.score : null}
        reviewAnswers={result?.reviewAnswers}
      />
    );
  }

  return (
    <div>
      {autosaveStatus !== "idle" && (
        <p role="status" aria-live="polite">
          {autosaveStatus === "pending" && "Saving answers shortly..."}
          {autosaveStatus === "saving" && "Saving answers..."}
          {autosaveStatus === "saved" && "Answers saved"}
          {autosaveStatus === "error" &&
            "Autosave failed. Your answers will be sent again when you submit."}
        </p>
      )}
      <QuizRunner
        key={quizId}
        questions={questions}
        headerText={ui.headerText || quiz.title}
        onePerPage={ui.oneQuestionPerPage}
        onAnswerChange={handleAnswerChange}
        onSubmit={handleSubmit}
        timeLimit={ui.timeLimit || 0}
        initialAnswers={answers}
        initialState={result?.state}
        onAttemptStateChange={handleAttemptStateChange}
        uiSettings={ui}
        resultId={result?.id ?? quizId}
      />
    </div>
  );
};

export default QuizPreviewWrapper;