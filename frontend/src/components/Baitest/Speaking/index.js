import React, { useState, useEffect } from "react";

const MOTTOS = [
  {
    en: '"Success is earned through sweat and persistence."',
    vi: "Thành công được kiếm bằng mồ hôi và sự kiên trì.",
  },
  {
    en: '"Work hard today for a better tomorrow."',
    vi: "Làm việc chăm chỉ hôm nay để có ngày mai tốt đẹp hơn.",
  },
  {
    en: '"No shortcuts, just hard work."',
    vi: "Không có lối tắt, chỉ có làm việc chăm chỉ.",
  },
  {
    en: '"Dream big, work harder."',
    vi: "Mơ lớn, làm việc chăm chỉ hơn.",
  },
  {
    en: '"Effort today, pride forever."',
    vi: "Nỗ lực hôm nay, tự hào mãi mãi.",
  },
];

const PromptCard = ({ children }) => (
  <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 font-serif text-xl font-bold italic text-slate-800 sm:text-2xl">
    {children}
  </div>
);

const SpeakingComponent = ({ setVideoUrl }) => {
  const [videoUrl, setVideoUrlState] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // Trạng thái để kiểm tra đã gửi hay chưa

  useEffect(() => {
    // Tải video URL từ localStorage khi component được khởi tạo
    const storedUrl = localStorage.getItem("videoUrl");
    if (storedUrl) {
      setVideoUrlState(storedUrl);
      setVideoUrl(storedUrl); // Cập nhật URL từ localStorage
    }
  }, [setVideoUrl]);

  const handleChange = (e) => {
    setVideoUrlState(e.target.value);
  };

  const handleSubmit = () => {
    if (!isSubmitted) {
      localStorage.setItem("videoUrl", videoUrl); // Lưu URL vào localStorage
      setVideoUrl(videoUrl); // Gọi hàm truyền từ component cha để cập nhật URL
      setIsSubmitted(true); // Đánh dấu là đã gửi
      alert("Video URL đã được gửi và lưu thành công!"); // Thông báo cho người dùng
    } else {
      alert("Bạn đã gửi URL video này rồi!"); // Thông báo nếu đã gửi
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 text-slate-800">
      <h2 className="m-0 rounded-lg bg-amber-100 px-4 py-4 text-xl font-bold leading-snug text-amber-900 sm:text-2xl">
        D. SPEAKING: Record a video of yourself answering the following question
        in 2 minutes, upload it and paste the link to your video below.
      </h2>

      <hr className="m-0 h-0.5 border-0 bg-slate-300" />

      <PromptCard>
        Chọn một phương châm sống sau đây và kể một câu chuyện đã xảy ra với em
        mà em thấy đúng với phương châm đó.
      </PromptCard>

      <PromptCard>
        Ghi hình em nói trong 2 phút, upload link ở ô trống bên dưới.
      </PromptCard>

      <PromptCard>
        Chọn một phương châm sống sau đây và kể một câu chuyện đã xảy ra với em
        mà em thấy đúng với phương châm đó:
        <ol className="m-0 mt-3 list-decimal space-y-1 pl-6 font-serif text-xl font-normal not-italic text-slate-600">
          {MOTTOS.map(({ en, vi }) => (
            <li key={en}>
              <strong className="text-slate-800">{en}</strong> - {vi}
            </li>
          ))}
        </ol>
      </PromptCard>

      <hr className="m-0 h-0.5 border-0 bg-slate-300" />

      <div>
        <label htmlFor="video-url" className="text-xl font-bold text-slate-800">
          Paste your video URL here:
        </label>
        <input
          id="video-url"
          type="text"
          value={videoUrl}
          onChange={handleChange}
          placeholder="Enter video URL"
          className="mt-2.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitted}
        className="cursor-pointer rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Submit
      </button>

      <p className="m-0 text-lg font-bold text-red-900">
        HAVE YOU LEFT YOUR EMAIL ADDRESS TO RECEIVE THE RESULT? IF NOT, PLEASE
        CONFIRM YOUR EMAIL BELOW.
      </p>
    </div>
  );
};

export default SpeakingComponent;
