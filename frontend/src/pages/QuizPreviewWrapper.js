// QuizPreviewWrapper.js
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import quizService from "../services/quizService";
import questionService from "../services/questionService";
import QuizStartScreen from "../components/QuizUI/QuizStartScreen";
import QuizRunner from "../components/QuizUI/QuizRunner";
import QuizSubmitScreen from "../components/QuizUI/QuizSubmitScreen";
import { Button } from "antd";
import config from '../config';
import { createAttemptAutosave } from "../services/attemptAutosave";
const QuizPreviewWrapper = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [scoreAfterSubmit, setScoreAfterSubmit] = useState(null);
  const [canRetry, setCanRetry] = useState(false); // ✅ thêm state mới
  const [autosaveStatus, setAutosaveStatus] = useState("idle");
  const autosaver = useRef(null);
  if (!autosaver.current) {
    autosaver.current = createAttemptAutosave({
      save: async ({ resultId, answers: answerList }) => {
        const response = await fetch(
          `${config.API_URL}/api/results/temp/${resultId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ answers: answerList }),
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
  useEffect(() => () => autosaver.current.cancelPending(), []);

  // -------------------------
  // Fetch quiz, questions, latest result
  // -------------------------
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setQuiz(null);
      setQuestions([]);
      setAnswers({});
      setHasStarted(false);
      setHasSubmitted(false);
      setResult(null);
      setAttemptNumber(1);
      setCanRetry(false);
      autosaver.current.cancelPending();

      try {
        const [fetchedQuiz, fetchedQuestions] = await Promise.all([
          quizService.getQuizById(quizId),
          questionService.getQuestionsByQuizId(quizId),
        ]);

        if (cancelled) return;
        setQuiz(fetchedQuiz);
        setQuestions(fetchedQuestions);

        const token = localStorage.getItem("token");
        const latestRes = await fetch(`${config.API_URL}/api/results/latest/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!latestRes.ok) {
          throw new Error(`Failed to load latest attempt: HTTP ${latestRes.status}`);
        }
        const latestBody = await latestRes.json();
        let latestData = Object.prototype.hasOwnProperty.call(latestBody ?? {}, "data")
          ? latestBody.data
          : latestBody;
        console.log("✅ Latest result (backend):", latestData);

        // 🧠 Nếu không có result thì tạo mới
        if (!latestData) {
          console.log("🚀 No latest result found, creating a new attempt...");
          const startRes = await fetch(`${config.API_URL}/api/results/start/${quizId}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!startRes.ok) {
            throw new Error(`Failed to start attempt: HTTP ${startRes.status}`);
          }
          const startBody = await startRes.json();
          const startData = startBody?.data ?? startBody;
          console.log("✅ Created result:", startData);

          if (!startData?.id) {
            alert("Không thể tạo result mới. Vui lòng thử lại.");
            return;
          }

          setResult(startData);
          setAnswers({});
          setAttemptNumber(startData.attemptNumber || 1);
          return;
        }

        // 🧩 Nếu kết quả đã nộp
        if (latestData.submittedAt) {
          const lastScore = latestData.score || 0;
          console.log(
            `📦 Latest result already submitted — score: ${lastScore}%`
          );

          const restored = (latestData.answers || []).reduce((acc, curr) => {
            const questionId = curr?.questionId ?? curr?.question;
            if (questionId != null) acc[questionId] = curr.answer;
            return acc;
          }, {});

          setResult(latestData);
          setAnswers(restored);
          setHasSubmitted(true);
          setAttemptNumber(latestData.attemptNumber || 1);

          if (lastScore < Number(fetchedQuiz.passingScore ?? 90)) {
            console.log("🔁 Score < 90% → allow retry after viewing result");
            setCanRetry(true);
          } else {
            console.log("✅ Score >= 90% → viewing mode only");
          }

          return;
        }

        // 🧩 Nếu chưa nộp thì resume lại
        console.log("📍 Resuming not-yet-submitted result:", latestData.id);
        setResult(latestData);

        const restored = (latestData.answers || []).reduce((acc, curr) => {
          const questionId = curr?.questionId ?? curr?.question;
          if (questionId != null) acc[questionId] = curr.answer;
          return acc;
        }, {});
        setAnswers(restored);
        setAttemptNumber(latestData.attemptNumber || 1);
      } catch (err) {
        console.error("❌ Error fetching quiz data:", err);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [quizId]);

  // -------------------------
  // Start handler
  // -------------------------
  const handleStart = () => setHasStarted(true);

  // -------------------------
  // Handle answer change (local + temp-save)
  // -------------------------
  const handleAnswerChange = (questionId, userAnswer) => {
    const newAnswers = { ...answers, [questionId]: userAnswer };
    setAnswers(newAnswers);
    console.log("📝 [FE] Answer changed:", {
      questionId,
      userAnswer,
      allAnswers: newAnswers,
    });

    if (!result?.id || result?.submittedAt) return;

    const validQuestionIds = questions.map((q) => q.id);
    const answersArray = Object.entries(newAnswers)
      .filter(([qid]) => validQuestionIds.includes(parseInt(qid)))
      .map(([qid, ans]) => ({
        questionId: parseInt(qid),
        answer: ans,
        type:
          questions.find((q) => q.id === parseInt(qid))?.question_type ||
          "unknown",
      }));

    autosaver.current.schedule({ resultId: result.id, answers: answersArray });
  };

  // -------------------------
  // Submit handler
  // -------------------------
  const handleSubmit = async () => {
    console.log("🔔 handleSubmit called!");
    console.log("🧪 Attempt number:", attemptNumber);

    try {
      const token = localStorage.getItem("token");
      autosaver.current.cancelPending();
      await autosaver.current.waitForIdle();

      let currentResult = result;
      if (!currentResult?.id) {
        const startRes = await fetch(`${config.API_URL}/api/results/start/${quizId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!startRes.ok) {
          throw new Error(`Failed to start attempt: HTTP ${startRes.status}`);
        }
        const startBody = await startRes.json();
        currentResult = startBody?.data ?? startBody;
        if (!currentResult?.id) {
          throw new Error("Start attempt returned no result id");
        }
        setResult(currentResult);
        setAttemptNumber(currentResult.attemptNumber || 1);
      }

      const answersArray = questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] ?? null,
        type: q.question_type || "unknown",
      }));

      let submitUrl = `${config.API_URL}/api/results/submit/${currentResult.id}`;

      if (currentResult.submittedAt) {
        console.log(
          "🔁 Current result already submitted — creating new attempt before submit..."
        );
        const startRes = await fetch(`${config.API_URL}/api/results/start/${quizId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!startRes.ok) {
          throw new Error(`Failed to start retry: HTTP ${startRes.status}`);
        }
        const startBody = await startRes.json();
        currentResult = startBody?.data ?? startBody;
        if (!currentResult?.id) {
          alert("Không thể tạo result mới để nộp bài.");
          return;
        }
        setResult(currentResult);
        setAttemptNumber(currentResult.attemptNumber || 1);
        submitUrl = `${config.API_URL}/api/results/submit/${currentResult.id}`;
      }

      console.log("📤 Submitting answers to:", submitUrl);
      const submitRes = await fetch(submitUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers: answersArray }),
      });

      if (!submitRes.ok) {
        throw new Error(`Submit failed with HTTP ${submitRes.status}`);
      }
      const submitBody = await submitRes.json();
      const submittedResult =
        submitBody?.data?.result ??
        submitBody?.result ??
        submitBody?.data ??
        submitBody;
      if (!submittedResult?.id) {
        throw new Error("Submit response did not contain the saved result");
      }
      console.log("🎯 Submit response:", submittedResult);

      setHasSubmitted(true);
      setScoreAfterSubmit(submittedResult.score || 0);
      setResult(submittedResult);
    } catch (err) {
      console.error("❌ Error while submitting:", err);
      alert(err.message || "Không thể nộp bài. Vui lòng thử lại.");
    }
  };

  // -------------------------
  // Helper: build initialAnswers for everyone_record
  // -------------------------
  const buildInitialAnswersForQuestion = (q) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(q.question_text || "", "text/html");
      const clozeEls = Array.from(doc.querySelectorAll(".cloze"));
      let gapIdx = 0,
        ddIdx = 0,
        hintIdx = 0;
      const ansObj = {};
      clozeEls.forEach((el, domIdx) => {
        if (el.classList.contains("dropdown")) {
          const dd = (q.dropdowns || [])[ddIdx++];
          ansObj[`dropdown_${domIdx}`] =
            dd?.correct_answer ?? el.textContent.trim() ?? "";
          return;
        }
        const isHint = !!(el.closest && el.closest(".hint-wrapper"));
        if (isHint) {
          const hw = (q.hintWords || [])[hintIdx++];
          ansObj[`gap_${domIdx}`] = hw?.word ?? el.textContent.trim() ?? "";
          return;
        }
        const gap = (q.gaps || [])[gapIdx++];
        ansObj[`gap_${domIdx}`] =
          gap?.correct_answers?.[0] ?? el.textContent.trim() ?? "";
      });
      return ansObj;
    } catch (err) {
      console.error("❌ buildInitialAnswersForQuestion error:", err);
      return {};
    }
  };

  // -------------------------
  // Render branch: loading
  // -------------------------
  if (!quiz)
    return <div className="text-center mt-10">⏳ Đang tải quiz...</div>;

  if (quiz.visibleTo === "just_me") {
    return (
      <div className="text-center mt-10">
        🚫 Bài quiz này không khả dụng với bạn.
      </div>
    );
  }

  // everyone_record mode
  if (quiz.visibleTo === "everyone_record") {
    const initialAnswersMap = {};
    questions.forEach((q) => {
      initialAnswersMap[q.id] = buildInitialAnswersForQuestion(q);
    });
    const correctAnswersArray = questions.map((q) => ({
      questionId: q.id,
      answer: initialAnswersMap[q.id] || {},
    }));

    return (
      <QuizRunner
        key={quizId + "_everyone_record"}
        questions={questions}
        headerText={quiz.title}
        onePerPage={false}
        onAnswerChange={() => {}}
        onSubmit={() => {}}
        timeLimit={0}
        hasSubmitted={true}
        showCorrectAnswer={true}
        initialAnswers={initialAnswersMap}
        uiSettings={quiz.uiSettings || {}}
        correctAnswers={correctAnswersArray}
      />
    );
  }

  const ui = quiz.uiSettings || {};
  const showInstructions = ui.showInstructionInput && ui.instructionText;

  if (showInstructions && !hasStarted && !hasSubmitted) {
    return (
      <QuizStartScreen
        instruction={ui.instructionText}
        onStart={handleStart}
        timeLimit={ui.timeLimit}
      />
    );
  }

  // ✅ Hiển thị kết quả + nút làm lại (nếu score < 90)
  if (hasSubmitted && ui.showCompletionInput) {
    return (
      <div className="text-center mt-6">
        <QuizSubmitScreen
          message={ui.quizCompleteMessage}
          hasSubmitted={hasSubmitted}
          score={ui.displayScore ? result?.score : null}
          answers={answers}
          scoreAfterSubmit={scoreAfterSubmit}
          correctAnswers={(result?.result || result)?.correctAnswers || []}
        />
        {canRetry && (
          <Button
            type="primary"
            className="mt-4"
            onClick={async () => {
              const token = localStorage.getItem("token");
              console.log("🔁 User requested retry, creating new attempt...");
              const startRes = await fetch(`${config.API_URL}/api/results/start/${quizId}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
              });
              const startData = await startRes.json();
              if (!startData?.id) {
                alert("Không thể tạo result mới. Vui lòng thử lại.");
                return;
              }
              console.log("✅ New retry attempt created:", startData);
              setResult(startData);
              setAnswers({});
              setHasSubmitted(false);
              setCanRetry(false);
              setAttemptNumber(
                startData.attemptNumber || (result?.attemptNumber || 0) + 1
              );
            }}
          >
            🔁 Làm lại quiz
          </Button>
        )}
      </div>
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
        key={quizId + "_" + result?.id}
        questions={questions}
        headerText={ui.headerText || quiz.title}
        onePerPage={ui.oneQuestionPerPage}
        onAnswerChange={handleAnswerChange}
        onSubmit={handleSubmit}
        timeLimit={ui.timeLimit || 0}
        hasSubmitted={hasSubmitted}
        showCorrectAnswer={quiz.visibleTo === "everyone_record" || hasSubmitted}
        initialAnswers={answers}
        uiSettings={ui}
        scoreAfterSubmit={scoreAfterSubmit}
        correctAnswers={(result?.result || result)?.correctAnswers || []}
      />
    </div>
  );
};

export default QuizPreviewWrapper;
