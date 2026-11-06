import React, { useEffect, useState } from "react";
import { Table, Tag, Spin, Button } from "antd";
import moment from "moment";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { DownloadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import config from "../config";

// Chuẩn hóa đáp án để so sánh
const normalizeAnswer = (answer) => {
  if (!answer) return "";
  return answer.toString().trim().toLowerCase().replace(/\s+/g, " ");
};

const StatBlock = ({ label, children }) => (
  <div>
    <p className="m-0 text-sm text-slate-500">{label}</p>
    {children}
  </div>
);

const QuizResultTable = () => {
  const { userId, quizId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [bestAttempt, setBestAttempt] = useState(null);
  const [questionParts, setQuestionParts] = useState([]);
  const [correctAnswersRow, setCorrectAnswersRow] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${config.API_URL}/api/results/user/${userId}/quiz/${quizId}/best-attempt`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const { attempts, bestAttempt, questionParts, correctAnswersRow } =
        res.data;

      // Sắp xếp attempts theo score giảm dần (đáp án tốt nhất lên đầu)
      const sortedAttempts = (attempts || []).sort((a, b) => b.score - a.score);

      setData(sortedAttempts);
      setBestAttempt(bestAttempt);
      setQuestionParts(questionParts || []);
      setCorrectAnswersRow(correctAnswersRow || []);
    } catch (err) {
      console.error("❌ Failed to fetch results:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && quizId) fetchResults();
  }, [userId, quizId]);

  const exportToPDF = () => {
    if (!bestAttempt) return;

    const doc = new jsPDF();
    const userName =
      bestAttempt.user?.firstName || bestAttempt.user?.email || "User";
    const quizTitle = bestAttempt.quiz?.title || "Quiz";

    doc.setFontSize(16);
    doc.text(`Results: ${userName} - ${quizTitle}`, 14, 20);

    // Header với đáp án thay vì Gap
    const head = [
      [
        "Attempt",
        "Score",
        "Submitted At",
        ...correctAnswersRow.map((ans, idx) => ans || `Q${idx + 1}`),
      ],
    ];

    const body = data.map((record) => [
      record.attemptNumber,
      `${record.score}%`,
      moment(record.submittedAt).format("YYYY-MM-DD HH:mm"),
      ...record.userAnswersRow.map((ans, idx) => {
        const correct = record.answerStatusRow?.[idx];
        const val = ans || "—";
        return correct === null ? val : correct ? `✔ ${val}` : `✘ ${val}`;
      }),
    ]);

    doc.autoTable({
      head,
      body,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    const correctRow = [
      "Correct Answers",
      "",
      "",
      ...correctAnswersRow.map((ans) => ans || "—"),
    ];

    doc.autoTable({
      body: [correctRow],
      startY: doc.lastAutoTable.finalY + 10,
      styles: { fontStyle: "bold", fillColor: [255, 255, 204] },
    });

    doc.save(`${userName}-${quizTitle}-results.pdf`);
  };

  const baseColumns = [
    {
      title: "Attempt",
      dataIndex: "attemptNumber",
      key: "attempt",
      align: "center",
      width: 100,
      render: (attemptNumber, record, index) => (
        <span className="inline-flex items-center gap-2">
          <span>{attemptNumber}</span>
          {index === 0 && (
            <Tag color="gold" style={{ fontSize: 10, margin: 0 }}>
              BEST
            </Tag>
          )}
        </span>
      ),
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      align: "center",
      width: 100,
      render: (score) => (
        <Tag color={score >= 80 ? "green" : score >= 50 ? "orange" : "red"}>
          {score}%
        </Tag>
      ),
    },
    {
      title: "Submitted At",
      dataIndex: "submittedAt",
      key: "date",
      align: "center",
      width: 180,
      render: (date) => moment(date).format("YYYY-MM-DD HH:mm"),
    },
  ];

  // Cột đáp án: header là đáp án đúng thay vì "Gap 1, 2, 3"
  const answerColumns = correctAnswersRow.map((correctAnswer, idx) => ({
    title: (
      <div className="text-center">
        <div className="font-semibold text-emerald-600">
          {correctAnswer || `Q${idx + 1}`}
        </div>
        <div className="text-[11px] font-normal text-slate-400">
          (Correct Answer)
        </div>
      </div>
    ),
    key: `q-${idx}`,
    align: "center",
    width: 150,
    render: (record) => {
      const userAnswer = record.userAnswersRow?.[idx];
      const answerStatus = record.answerStatusRow?.[idx];

      // Không có status (câu hỏi không chấm điểm)
      if (answerStatus === null || answerStatus === undefined) {
        return <Tag color="default">{userAnswer || "—"}</Tag>;
      }

      const isCorrect =
        normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);

      return (
        <div className="flex flex-col items-center gap-1">
          <Tag color={isCorrect ? "green" : "red"} style={{ margin: 0 }}>
            {userAnswer || "—"}
          </Tag>
          {!isCorrect && userAnswer && (
            <span className="text-[11px] text-slate-500">
              Expected: {correctAnswer}
            </span>
          )}
        </div>
      );
    },
  }));

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="m-0 text-2xl font-semibold tracking-tight text-slate-900">
              Quiz results
            </h3>
            {bestAttempt && (
              <p className="m-0 mt-1 text-sm text-slate-500">
                {bestAttempt.user?.firstName || bestAttempt.user?.email} -{" "}
                {bestAttempt.quiz?.title}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={exportToPDF}
              disabled={!bestAttempt}
            >
              Export PDF
            </Button>
          </div>
        </div>

        {/* Best score */}
        {bestAttempt && (
          <div className="flex flex-wrap gap-x-10 gap-y-4 rounded-lg border border-blue-100 bg-blue-50/60 px-5 py-4">
            <StatBlock label="Best score">
              <p className="m-0 text-3xl font-semibold text-blue-600">
                {bestAttempt.score}%
              </p>
            </StatBlock>
            <StatBlock label="Total attempts">
              <p className="m-0 text-3xl font-semibold text-slate-900">
                {data.length}
              </p>
            </StatBlock>
            <StatBlock label="Status">
              <Tag
                color={bestAttempt.passed ? "green" : "red"}
                style={{ fontSize: 16, padding: "4px 12px", marginTop: 4 }}
              >
                {bestAttempt.passed ? "PASSED" : "FAILED"}
              </Tag>
            </StatBlock>
          </div>
        )}

        {/* Results table */}
        <Spin spinning={loading}>
          <Table
            columns={[...baseColumns, ...answerColumns]}
            dataSource={data}
            rowKey={(record) => `${record.id}-${record.attemptNumber}`}
            pagination={false}
            bordered
            scroll={{ x: "max-content" }}
            rowClassName={(record, index) =>
              index === 0
                ? "[&>td]:!bg-amber-50 hover:[&>td]:!bg-amber-100"
                : ""
            }
          />

          {/* Answer key */}
          {correctAnswersRow.length > 0 && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <h4 className="m-0 mb-3 text-sm font-semibold text-emerald-800">
                Answer key
              </h4>
              <div className="flex flex-wrap gap-2">
                {correctAnswersRow.map((answer, idx) => (
                  <Tag
                    key={idx}
                    color="success"
                    style={{ fontSize: 13, margin: 0 }}
                  >
                    {idx + 1}. {answer || "—"}
                  </Tag>
                ))}
              </div>
            </div>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default QuizResultTable;
