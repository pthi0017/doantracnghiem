// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');  // Kiểm tra xem người dùng đã đăng nhập chưa

  return isAuthenticated ? children : <Navigate to="/login" />;  // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
};

export default PrivateRoute;
