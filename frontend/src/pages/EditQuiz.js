import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import questionService from "../services/questionService";
const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    version: 1,
  });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`${config.API_URL}/api/quizzes/${id}`);
        const quiz = res.data?.data ?? res.data;
        setForm({
          title: quiz.title || "",
          description: quiz.description || "",
          version: quiz.version,
        });

        const fetchedQuestions =
          await questionService.getQuestionsByQuizId(id);
        setQuestions(fetchedQuestions);
      } catch (err) {
        console.error("❌ Lỗi khi tải quiz hoặc câu hỏi", err);
        alert("Không tìm thấy quiz hoặc câu hỏi!");
        navigate("/quiz-manage");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id, navigate]);

  // Xử lý thay đổi input quiz
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi nội dung câu hỏi
  const handleQuestionChange = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  // Gửi cập nhật quiz
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${config.API_URL}/api/quizzes/${id}`, {
        ...form,
        questions,
      });

      console.log("✅ Quiz updated:", res.data);

      alert("✅ Cập nhật thành công!");
      navigate("/quiz-manage");
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật quiz", err);
      alert(
        err.response?.data?.message ||
          "Không thể cập nhật quiz.",
      );
    }
  };

  return (
    <div className="container mt-4">
      <h3>✏️ Chỉnh sửa Quiz</h3>
      {loading ? (
        <div>⏳ Đang tải dữ liệu...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tiêu đề</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleInput}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInput}
              className="form-control"
              rows="3"
            />
          </div>

          <h5 className="mt-4">📝 Câu hỏi</h5>
          {questions.length === 0 ? (
            <p>⚠️ Chưa có câu hỏi nào trong quiz.</p>
          ) : (
            questions.map((q, index) => (
              <div key={index} className="mb-3 p-2 border rounded">
                <label className="form-label">Câu hỏi {index + 1}</label>
                <textarea
                  className="form-control mb-2"
                  rows="2"
                  value={q.content || ""}
                  onChange={(e) =>
                    handleQuestionChange(index, "content", e.target.value)
                  }
                />
                <label className="form-label">Đáp án đúng</label>
                <input
                  type="text"
                  className="form-control"
                  value={q.correct_answer || ""}
                  onChange={(e) =>
                    handleQuestionChange(index, "correct_answer", e.target.value)
                  }
                />
              </div>
            ))
          )}

          <button className="btn btn-primary me-2" type="submit">
            💾 Lưu thay đổi
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => navigate("/quiz-manage")}
          >
            🔙 Quay lại
          </button>
        </form>
      )}
    </div>
  );
};

export default EditQuiz;
