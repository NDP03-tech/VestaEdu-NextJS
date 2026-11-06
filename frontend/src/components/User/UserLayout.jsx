import React from "react";
import { Outlet } from "react-router-dom";
import UserHeader from "./userHeader";

const UserLayout = () => (
  <div className="flex min-h-screen flex-col bg-slate-50">
    <UserHeader />
    <main className="flex-1">
      <Outlet />
    </main>
  </div>
);

export default UserLayout;
