import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui/Card";

export const SingleEvent = ({
  eventClass = "",
  eventID,
  eventDayCount = "10",
  eventDate = "April, 2022",
  eventStartTime = "10:30 AM",
  eventEndTime = "12:30 PM",
  eventTitle = "A Better Alternative To Grading Student Writing",
  eventBtnText = "Find Out More",
  eventLocation = "New York, USA",
}) => {
  return (
    <Card
      hover
      className={`group flex flex-col md:flex-row items-stretch overflow-hidden bg-white transition-all duration-300 hover:shadow-lg ${eventClass}`}
    >
      {/* Date banner */}
      <div className="flex flex-col items-center justify-center bg-blue-50 px-6 py-6 md:w-36 text-center border-b md:border-b-0 md:border-r border-blue-100">
        <span className="text-3xl font-extrabold text-blue-600 tracking-tight leading-none">
          {eventDayCount}
        </span>
        <span className="mt-1 text-xs font-semibold text-slate-600 uppercase tracking-wide">
          {eventDate}
        </span>
        <span className="mt-2 inline-block rounded bg-blue-100/70 px-2 py-0.5 text-[11px] font-medium text-blue-800">
          {eventStartTime}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              {eventStartTime} - {eventEndTime}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-blue-600 line-clamp-2 mb-3">
            <Link to={`/event/${eventID}`}>{eventTitle}</Link>
          </h3>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{eventLocation}</span>
          </div>

          <Link
            to={`/event/${eventID}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            {eventBtnText}
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default SingleEvent;
