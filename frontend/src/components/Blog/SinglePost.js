import React from "react";
import { Link } from "react-router-dom";
import blogImg1 from "../../assets/images/blog/1.jpg";

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SinglePost = (props) => {
  const {
    blogClass,
    blogID,
    blogImage,
    blogTitle,
    blogCategory,
    blogAuthor,
    blogPublishedDate,
  } = props;

  const blogUrl = `/blog/${blogID}`;
  const title = blogTitle ? blogTitle : "How to growing your business";

  return (
    <div
      className={`${blogClass ? blogClass : "mb-[50px]"} flex h-full flex-col`}
    >
      <article className="group flex h-full flex-col overflow-hidden rounded-[10px] border border-line bg-white font-body shadow-card transition duration-200 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-lift">
        {/* ── Thumbnail ── */}
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-navy-mid">
          <Link to={blogUrl} className="block h-full w-full">
            <img
              src={blogImage || blogImg1}
              alt={blogTitle || "Blog"}
              loading="lazy"
              className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
          <span className="absolute bottom-3 left-3 rounded bg-navy/80 px-2.5 py-1 text-xs font-medium leading-none text-white backdrop-blur-sm">
            {blogPublishedDate ? blogPublishedDate : "April 18"}
          </span>
        </div>

        {/* ── Content ── */}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <span className="mb-3 w-fit rounded bg-gold/15 px-2.5 py-1 text-[11px] font-semibold uppercase leading-none tracking-[0.1em] text-navy">
            {blogCategory ? blogCategory : "Education"}
          </span>

          <h3 className="m-0 mb-4 font-display text-xl font-semibold leading-[1.35] text-ink">
            <Link
              to={blogUrl}
              className="line-clamp-2 text-inherit no-underline transition-colors hover:text-gold"
            >
              {title}
            </Link>
          </h3>

          <div className="mt-auto flex items-center gap-2 border-t border-line pt-4 text-[13px] text-ink-mid">
            <span className="text-gold">
              <UserIcon />
            </span>
            <span className="truncate font-medium">
              {blogAuthor ? blogAuthor : "Charlie Doyle"}
            </span>
          </div>
        </div>
      </article>
    </div>
  );
};

export default SinglePost;
