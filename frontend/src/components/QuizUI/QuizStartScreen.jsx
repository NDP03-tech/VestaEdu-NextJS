import React from "react";
import { Card, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";

const QuizStartScreen = ({ instruction, onStart }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-slate-200/80 shadow-xl overflow-hidden rounded-2xl">
        {/* Top Decorative Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md mb-3">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Hướng dẫn làm bài</h2>
          <p className="text-xs text-blue-100 mt-1">Vui lòng đọc kỹ thông tin trước khi bắt đầu</p>
        </div>

        <CardBody className="p-8">
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-6 text-slate-700 leading-relaxed text-sm max-h-[50vh] overflow-y-auto">
            {instruction ? (
              <div
                className="whitespace-pre-wrap prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: instruction }}
              />
            ) : (
              <p className="text-slate-400 italic text-center">Không có hướng dẫn bổ sung cho bài thi này.</p>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              onClick={onStart}
              className="px-10 py-3.5 text-base font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all"
            >
              🚀 Bắt đầu làm bài
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default QuizStartScreen;
