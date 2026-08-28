import React from 'react';

const AdminRoute = ({ isLoggedIn }) => {
  const role = localStorage.getItem('role');
  if (!isLoggedIn || role !== 'admin') {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default AdminRoute;
