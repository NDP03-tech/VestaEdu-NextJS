import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Dropdown } from "antd";
import {
  ClipboardList,
  BarChart3,
  LogOut,
  User,
  AlignJustify,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/user/quizzes", label: "My Quizzes", icon: ClipboardList },
  { to: "/user/results", label: "Results", icon: BarChart3 },
];

const UserHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const userMenuItems = [
    {
      key: "profile",
      icon: <User size={16} />,
      label: "My Profile",
      onClick: () => navigate("/user/profile"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogOut size={16} />,
      label: "Log Out",
      onClick: handleLogout,
      danger: true,
    },
  ];

  const navLinkClass = (active, large = false) =>
    `flex items-center rounded-lg border font-semibold no-underline transition-colors ${
      large ? "gap-3 px-5 py-3.5 text-base" : "gap-2 px-4 py-2 text-sm"
    } ${
      active
        ? "border-blue-100 bg-blue-50 text-blue-700"
        : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-[1000] border-b border-slate-200 bg-white/90 px-[clamp(16px,5vw,48px)] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between">
        {/* Logo */}
        <Link to="/user" className="group flex items-center gap-3 no-underline">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white shadow-sm transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105">
            V
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            VestaEdu Academy
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className={navLinkClass(isActive(to))}>
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}

          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <button
              type="button"
              className="ml-3 flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <User size={18} />
              </span>
              Account
            </button>
          </Dropdown>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50 md:hidden"
        >
          {mobileMenuOpen ? <X size={24} /> : <AlignJustify size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute inset-x-0 top-full border-b border-slate-200 bg-white p-4 shadow-lg md:hidden">
          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass(isActive(to), true)}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            ))}

            <div className="my-1 h-px bg-slate-200" />

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-red-100 bg-white px-5 py-3.5 text-base font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut size={20} />
              Log Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default UserHeader;
