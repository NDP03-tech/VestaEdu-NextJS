import React from "react";
import { Link } from "react-router-dom";
import courseImg1 from "../../assets/images/course/1.png";
import {
  PlayIcon,
  UserIcon,
  BookIcon,
  ClockIcon,
  ArrowRightIcon,
  StarRating,
  PriceTag,
} from "./CourseCardParts";

const SingleCourseThreeCustom = (props) => {
  const {
    itemClass,
    courseID,
    courseImg,
    courseName,
    courseTitle,
    courseAuthor,
    courseType,
    courseLesson,
    coursePrice,
    courseDuration,
    courseReview,
    courseDis,
  } = props;

  const reviewScore = parseFloat(courseReview) || 4.5;
  const courseUrl = `/course/${courseID}`;

  return (
    <div className={itemClass ? itemClass : "h-full w-full"}>
      <article
        className="group relative flex h-full flex-col overflow-hidden rounded-[10px] border border-line bg-white font-body shadow-card transition duration-200
          before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-0.5 before:bg-gradient-to-r before:from-transparent before:via-gold before:to-transparent before:opacity-0 before:transition-opacity
          hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-lift hover:before:opacity-100"
      >
        {/* ── Thumbnail ── */}
        <Link
          to={courseUrl}
          className="relative block h-[200px] w-full shrink-0 overflow-hidden bg-navy-mid sm:h-[170px] lg:h-[185px]"
        >
          <img
            src={courseImg || courseImg1}
            alt={courseTitle || "Course"}
            className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-navy/[.35] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <span className="flex h-[46px] w-[46px] scale-[0.8] items-center justify-center rounded-full bg-gold pl-0.5 text-navy shadow-[0_4px_20px_rgba(201,168,76,0.55)] transition-transform duration-200 group-hover:scale-100">
              <PlayIcon />
            </span>
          </div>

          {courseName && (
            <span className="absolute left-3 top-3 z-[2] rounded bg-gold px-[9px] py-1 text-[10px] font-bold uppercase leading-none tracking-[0.12em] text-navy shadow-md">
              {courseName}
            </span>
          )}
          {courseType && (
            <span className="absolute right-3 top-3 z-[2] rounded border border-white/20 bg-navy/70 px-[9px] py-1 text-[10px] font-medium uppercase leading-none tracking-[0.09em] text-white backdrop-blur-sm">
              {courseType}
            </span>
          )}
        </Link>

        {/* ── Body ── */}
        <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-4 sm:px-[18px] sm:pb-4 sm:pt-[18px]">
          <h4 className="m-0 mb-2.5 font-display text-[17px] font-semibold leading-[1.42] text-ink lg:text-lg">
            <Link
              to={courseUrl}
              className="line-clamp-2 text-inherit no-underline transition-colors hover:text-gold"
            >
              {courseTitle || "The Most Complete Design Thinking Course"}
            </Link>
          </h4>

          <p className="m-0 mb-2.5 flex items-center gap-1.5 text-[12.5px] text-ink-mid">
            <span className="shrink-0 text-gold">
              <UserIcon />
            </span>
            <span className="truncate">{courseAuthor || "Instructor"}</span>
          </p>

          <div className="mb-2.5 flex flex-wrap items-center gap-3.5">
            {courseLesson && (
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-ink-muted">
                <span className="text-gold">
                  <BookIcon />
                </span>
                {courseLesson} bài
              </span>
            )}
            {courseDuration && (
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-ink-muted">
                <span className="text-gold">
                  <ClockIcon />
                </span>
                {courseDuration}
              </span>
            )}
          </div>

          <div className="mb-3.5">
            <StarRating score={reviewScore} />
          </div>

          <div className="mb-3.5 h-px shrink-0 bg-line" />

          <div className="mt-auto flex items-center justify-between gap-2.5">
            <PriceTag
              price={coursePrice}
              original={courseDis}
              freeLabel="Miễn phí"
            />
            <Link
              to={courseUrl}
              className="group/cta inline-flex shrink-0 items-center gap-1.5 rounded bg-navy px-4 py-[9px] text-[12.5px] font-semibold tracking-[0.06em] text-white no-underline transition-all duration-200 hover:bg-gold hover:text-navy hover:shadow-[0_4px_16px_rgba(201,168,76,0.4)]"
            >
              Đăng ký
              <span className="transition-transform duration-200 group-hover/cta:translate-x-[3px]">
                <ArrowRightIcon />
              </span>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default SingleCourseThreeCustom;
