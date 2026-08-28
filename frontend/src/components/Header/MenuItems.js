import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const MenuItems = (props) => {
  const { parentMenu } = props;
  const router = useRouter();
  const postURL = router.pathname.split("/");
  const pathLength = Number(postURL.length);

  const [page, setPage] = useState(false);
  const [event, setEvent] = useState(false);
  const [course, setCourse] = useState(false);
  const [blog, setBlog] = useState(false);

  const openMobileMenu = (menu) => {
    setPage(menu === "page" ? !page : false);
    setEvent(menu === "event" ? !event : false);
    setCourse(menu === "course" ? !course : false);
    setBlog(menu === "blog" ? !blog : false);
  };

  return (
    <>
      {/* Pages - Có mũi tên nếu có mục con */}
      <li
        className={
          parentMenu === "page" || parentMenu === "event"
            ? "has-sub menu-active"
            : "has-sub"
        }
      >
        <Link
          to="#"
          className={page ? "hash menu-active" : "hash"}
          onClick={() => openMobileMenu("page")}
        >
          Pages {page && <span className="arrow"></span>}{" "}
          {/* Hiển thị mũi tên nếu menu con đang mở */}
        </Link>
        <ul className={page ? "sub-menu sub-menu-open" : "sub-menu"}>
          {/* Home - Là con của Pages */}
          <li className={router.pathname === "/" ? "menu-active" : ""}>
            <Link
              to="/"
              className="hash"
              onClick={() => openMobileMenu("page")}
            >
              Home
            </Link>
          </li>
          <li className={router.pathname === "/about" ? "menu-active" : ""}>
            <Link href="/about">About</Link>
          </li>
          <li
            className={
              postURL[1] === "instructor" && pathLength > 2 ? "menu-active" : ""
            }
          >
            <Link href="/instructor/1">Profile</Link>
          </li>
          <li className={router.pathname === "/event" ? "menu-active" : ""}>
            <Link href="/event">Event</Link>
          </li>
          <li className={router.pathname === "/blog" ? "menu-active" : ""}>
            <Link href="/blog">Blog</Link>
          </li>
        </ul>
      </li>

      {/* Events - Có mũi tên nếu có mục con */}
      <li className={parentMenu === "Teachers" ? "has-sub" : ""}>
        <Link
          to="/instructor"
          className={event ? "hash menu-active" : "hash"}
          onClick={() => openMobileMenu("event")}
        >
          Teachers {event && <span className="arrow"></span>}{" "}
          {/* Hiển thị mũi tên nếu menu con đang mở */}
        </Link>
      </li>

      {/* Courses - Không có mũi tên */}
      <li className={parentMenu === "course" ? "has-sub" : ""}>
        <Link
          to="/course"
          className={course}
          onClick={() => openMobileMenu("course")}
        >
          Courses
        </Link>
      </li>

      {/* Blog - Không có mũi tên */}
      <li className={parentMenu === "contact" ? "has-sub" : ""}>
        <Link
          to="/contact"
          className={blog ? "hash menu-active" : "hash"}
          onClick={() => openMobileMenu("blog")}
        >
          Contact
        </Link>
      </li>

      {/* Login - Không có mũi tên */}
      <li className={router.pathname === "/login" ? "menu-active" : ""}>
        <Link href="/login">Login</Link>
      </li>
      <li className={router.pathname === "/test" ? "menu-active" : ""}>
        <a href="/test" target="_blank" rel="noopener noreferrer">
          Test
        </a>
      </li>
    </>
  );
};

export default MenuItems;
