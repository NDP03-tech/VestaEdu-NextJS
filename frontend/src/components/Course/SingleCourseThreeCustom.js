import React from "react";
import { Link } from "react-router-dom";
import courseImgFallback from "../../assets/images/course/1.png";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

export const SingleCourseThreeCustom = ({
  itemClass = "",
  courseID,
  courseImg,
  courseName,
  courseTitle = "The Most Complete Design Thinking Course",
  courseAuthor = "John Doe",
  courseType,
  courseLesson,
  coursePrice,
  courseDuration,
  courseReview = 4.5,
}) => {
  const isFree = !coursePrice || coursePrice === 0 || coursePrice === "0";
  const reviewScore = parseFloat(courseReview) || 4.5;

  return (
    <Card
      hover
      className={`group flex flex-col h-full bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${itemClass}`}
    >
      {/* ── Thumbnail ── */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Link to={`/course/${courseID}`} className="block h-full w-full">
          <img
            src={courseImg || courseImgFallback}
            alt={courseTitle}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {courseName && (
            <Badge variant="primary" size="sm" className="shadow-sm">
              {courseName}
            </Badge>
          )}
          {courseType && (
            <Badge variant="neutral" size="sm" className="shadow-sm bg-white/90 text-slate-800">
              {courseType}
            </Badge>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col p-5">
        <h4 className="mb-2.5 text-base font-bold text-slate-800 transition-colors group-hover:text-blue-600 line-clamp-2">
          <Link to={`/course/${courseID}`}>{courseTitle}</Link>
        </h4>

        {/* Author & Rating */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
          <span className="font-medium text-slate-700">{courseAuthor}</span>
          <div className="flex items-center gap-1 text-amber-500 font-semibold">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{reviewScore.toFixed(1)}</span>
          </div>
        </div>

        {/* Footer: Lesson, Duration, Price */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
          <div className="flex items-center gap-3 text-slate-500">
            {courseLesson && <span>{courseLesson} bài học</span>}
            {courseDuration && <span>• {courseDuration}</span>}
          </div>
          <span
            className={`font-bold text-sm ${
              isFree ? "text-emerald-600" : "text-blue-600"
            }`}
          >
            {isFree ? "Miễn phí" : `$${coursePrice}`}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default SingleCourseThreeCustom;
