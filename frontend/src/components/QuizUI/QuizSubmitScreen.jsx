import React from "react";
import { Card, CardBody } from "../ui/Card";

const QuizSubmitScreen = ({ score, message }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-xl border-slate-200/80 shadow-2xl rounded-2xl overflow-hidden text-center animate-fade-in">
        {/* Success Icon Badge */}
        <div className="bg-gradient-to-b from-emerald-50 to-white px-8 pt-10 pb-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
            <svg
              className="h-10 w-10 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <polyline
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                points="20 6 9 17 4 12"
              />
            </svg>
          </div>
          <h2 className="mt-5 text-2xl font-extrabold text-slate-800">
            Nộp bài thành công!
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Bạn đã hoàn thành bài kiểm tra
          </p>
        </div>

        <CardBody className="p-8 pt-2">
          {/* Score Badge */}
          {score !== null && score !== undefined && (
            <div className="my-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-lg shadow-emerald-500/20">
              <span className="text-xs uppercase tracking-widest text-emerald-100 font-semibold block mb-1">
                Điểm số của bạn
              </span>
              <span className="text-4xl font-black tracking-tight">
                {score}%
              </span>
            </div>
          )}

          {/* Feedback message */}
          {message && (
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-sm text-slate-600 leading-relaxed text-center">
              <div dangerouslySetInnerHTML={{ __html: message }} />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default QuizSubmitScreen;
