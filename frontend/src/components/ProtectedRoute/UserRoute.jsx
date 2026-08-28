import React from "react";

const UserRoute = ({ isLoggedIn }) => {
  const role = localStorage.getItem("role");
  if (!isLoggedIn || !["student", "teacher"].includes(role)) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default UserRoute;
