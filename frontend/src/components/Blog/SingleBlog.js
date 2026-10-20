import React from "react";
import { Link } from "react-router-dom";
import blogImgFallback from "../../assets/images/blog/1.jpg";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

export const SingleBlog = ({
  blogClass,
  blogID,
  blogImage,
  blogTitle = "How to growing your business",
  blogCategory = "Education",
  blogAuthor = "Charlie Doyle",
  blogPublishedDate = "April 18",
}) => {
  return (
    <Card
      hover
      className={`group flex flex-col h-full bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        blogClass || "mb-10"
      }`}
    >
      {/* Thumbnail area */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Link to={`/blog/${blogID}`} className="block h-full w-full">
          <img
            src={blogImage || blogImgFallback}
            alt={blogTitle}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        <span className="absolute bottom-3 left-3 rounded bg-blue-600/90 px-2.5 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
          {blogPublishedDate}
        </span>
      </div>

      {/* Content area */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3">
          <Badge variant="primary" size="sm">
            {blogCategory}
          </Badge>
        </div>

        <h3 className="mb-4 text-lg font-bold text-slate-800 transition-colors group-hover:text-blue-600 line-clamp-2">
          <Link to={`/blog/${blogID}`}>{blogTitle}</Link>
        </h3>

        {/* Footer with author */}
        <div className="mt-auto flex items-center gap-2 pt-4 border-t border-slate-100 text-sm text-slate-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-400"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span className="font-medium">{blogAuthor}</span>
        </div>
      </div>
    </Card>
  );
};

export default SingleBlog;
