import React, { useState } from "react";

const TOPICS = [
  {
    letter: "A",
    en: {
      text: "Many people tend to spread wrong stories about public figures and maliciously defame them over the Internet due to personal hatred or business competition. Unfortunately, the public tend to believe the information without questioning its reliability, especially when the news is negative and sensational.",
      question:
        "What are the consequences of this hasty belief in fake news and suggest some possible solutions to improve the critical thinking of the mass?",
    },
    vi: {
      text: "Nhiều người nói xấu và bôi nhọ người khác trên mạng do thù ghét hoặc cạnh tranh bẩn. Tuy nhiên, công chúng thường tin luôn những gì họ đọc, thông tin càng xấu, càng giật gân, càng dễ tin.",
      question:
        "Đâu là hậu quả của việc vội vàng tin lời đồn trên mạng (không kiểm chứng lời đồn) và giải pháp để cải thiện ý thức phản biện của người dân?",
    },
  },
  {
    letter: "B",
    en: {
      text: "In many countries, certificates and degrees are relied upon to assess a teacher's competence. For instance, if someone achieves a high position in a reputable Mathematics competition, they become eligible to teach Mathematics.",
      question:
        "Do you agree or disagree with this viewpoint? What attributes characterise a competent teacher?",
    },
    vi: {
      text: "Ở nhiều nước, bằng cấp và chứng chỉ được dùng để đánh giá năng lực giáo viên. Ví dụ, nếu một người đạt giải cao trong kì thi toán có tiếng thì họ đủ điều kiện để dạy toán.",
      question:
        "Em đồng ý hay không đồng ý với quan điểm này? Đâu là phẩm chất của một nhà giáo có năng lực?",
    },
  },
  {
    letter: "C",
    en: {
      text: "Many people believe there are shortcuts to success, for example winning a lottery for wealth or using tricks to excel in an IELTS exam. Others believe that everything comes at a cost, implying that success is the result of hard work.",
      question: "What is your opinion?",
    },
    vi: {
      text: "Nhiều người tin là có đường tắt đến thành công, ví dụ trúng số để có tiền hoặc dùng thủ thuật để qua bài kiểm tra IELTS. Nhiều người khác nói là mọi thứ đều có giá của nó và thành công là kết quả sự chăm chỉ bền bỉ.",
      question: "Hãy nêu quan điểm của em.",
    },
  },
];

const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;

const Topic = ({ letter, en, vi }) => (
  <article className="space-y-3 text-justify text-lg font-bold italic leading-relaxed text-slate-800">
    <p className="m-0">
      <span className="mr-1 text-2xl text-blue-900">{letter}.</span>
      {en.text} <span className="text-red-600">{en.question}</span>{" "}
      <span className="text-lg">GIVE YOUR ANSWER IN AT LEAST 250 WORDS.</span>
    </p>
    <p className="m-0">
      {vi.text} <span className="text-red-600">{vi.question}</span>
    </p>
  </article>
);

const WritingTask = ({ setEssayState }) => {
  const [essay, setEssay] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // Trạng thái để kiểm tra đã gửi hay chưa

  const handleChange = (e) => {
    const value = e.target.value;
    setEssayState(value);
    setEssay(value); // Cập nhật nội dung bài viết
  };

  const handleSubmit = () => {
    if (!isSubmitted) {
      localStorage.setItem("essay", essay); // Lưu nội dung bài viết vào localStorage
      setIsSubmitted(true); // Đánh dấu là đã gửi
      alert("Bài viết đã được gửi và lưu thành công!"); // Thông báo cho người dùng
    } else {
      alert("Bạn đã gửi bài viết này rồi!"); // Thông báo nếu đã gửi
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 text-slate-800">
      <div className="space-y-2 rounded-lg bg-amber-100 px-4 py-4 text-amber-900">
        <h2 className="m-0 text-2xl font-bold underline sm:text-3xl">
          C. WRITING TASK 2 - 40 MINUTES
        </h2>
        <p className="m-0 text-lg">
          CHOOSE 1 OF THE FOLLOWING QUESTIONS TO WRITE AN ESSAY IN RESPONSE TO
          IT.
        </p>
      </div>

      {TOPICS.map((topic, index) => (
        <React.Fragment key={topic.letter}>
          {index > 0 && <hr className="m-0 h-px border-0 bg-slate-200" />}
          <Topic {...topic} />
        </React.Fragment>
      ))}

      <hr className="m-0 h-px border-0 bg-slate-200" />

      {/* Textbox for writing the essay */}
      <div>
        <textarea
          aria-label="Essay"
          className="h-72 w-full resize-y rounded-md border border-slate-300 bg-white p-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="Write your essay here..."
          value={essay}
          onChange={handleChange}
        />
        <p className="m-0 mt-1 text-right text-sm text-slate-500">
          Word count: {countWords(essay)}
        </p>
      </div>

      {/* Nút Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitted}
        className="cursor-pointer rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Submit
      </button>
    </div>
  );
};

export default WritingTask;
