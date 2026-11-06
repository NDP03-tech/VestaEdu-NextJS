import React from "react";
import { Link } from "react-router-dom";
import defaultCourseImg from "../../assets/images/course/1.jpg";
import defaultAuthorImg from "../../assets/images/course/1.jpg";
import { FileTextIcon, ArrowRightIcon, PriceTag } from "./CourseCardParts";

const CLOUDINARY_BASE = "https://res.cloudinary.com/dubzoozqi/image/upload/";

const resolveImage = (img, fallback) => {
  if (!img) return fallback;
  return img.startsWith("http") ? img : `${CLOUDINARY_BASE}${img}`;
};

const SingleCourseList = (props) => {
  const {
    itemClass,
    courseID,
    courseImg,
    courseName,
    courseTitle,
    courseAuthor,
    courseAuthorImg,
    courseLesson,
    coursePrice,
  } = props;

  const courseUrl = `/course/${courseID}`;

  return (
    <div className={itemClass ? itemClass : "w-full"}>
      <article className="group flex flex-col overflow-hidden rounded-[10px] border border-line bg-white font-body shadow-card transition duration-200 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lift sm:flex-row">
        {/* ── Image ── */}
        <div className="relative h-[190px] w-full shrink-0 overflow-hidden bg-navy-mid sm:h-auto sm:w-56">
          <Link to={courseUrl} className="block h-full w-full">
            <img
              src={resolveImage(courseImg, defaultCourseImg)}
              alt={courseTitle || "Course"}
              className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
          <span className="absolute left-3 top-3 rounded bg-gold px-[9px] py-1 text-[10px] font-bold uppercase leading-none tracking-[0.12em] text-navy shadow-md">
            {courseName || "Beginner"}
          </span>
        </div>

        {/* ── Content ── */}
        <div className="flex min-w-0 flex-1 flex-col px-4 py-4 sm:px-5">
          <h4 className="m-0 mb-3 font-display text-[17px] font-semibold leading-[1.4] text-ink lg:text-lg">
            <Link
              to={courseUrl}
              className="line-clamp-2 text-inherit no-underline transition-colors hover:text-gold"
            >
              {courseTitle ||
                "The Most Complete Design Thinking Course On The Market."}
            </Link>
          </h4>

          <div className="flex items-center gap-2.5">
            <img
              src={resolveImage(courseAuthorImg, defaultAuthorImg)}
              alt={courseAuthor || "Author"}
              className="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-line"
            />
            <span className="truncate text-[12.5px] text-ink-mid">
              {courseAuthor || "Unknown Author"}
            </span>
          </div>

          <div className="my-3.5 h-px shrink-0 bg-line" />

          <div className="mt-auto flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-ink-muted">
              <span className="text-gold">
                <FileTextIcon size={15} />
              </span>
              {courseLesson || "0"} Lessons
            </span>
            <PriceTag price={coursePrice} freeLabel="Free" />
          </div>
        </div>

        {/* ── CTA ── */}
        <Link
          to={courseUrl}
          aria-label="View course"
          className="flex shrink-0 items-center justify-center border-t border-line bg-white py-3 text-navy no-underline transition-colors duration-200 hover:bg-navy hover:text-gold sm:w-14 sm:border-l sm:border-t-0 sm:py-0"
        >
          <ArrowRightIcon size={18} strokeWidth={1.5} />
        </Link>
      </article>
    </div>
  );
};

export default SingleCourseList;
