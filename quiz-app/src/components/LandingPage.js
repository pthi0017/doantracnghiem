import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/login"); // Chuyển hướng đến trang đăng nhập
  };

  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1>Chào mừng đến với Quiz App</h1>
        <p>Học hỏi, thử thách và phát triển bản thân qua các bài kiểm tra thú vị!</p>
        <div className="homepage-buttons">
          <button className="btn start-btn" onClick={handleStart}>Bắt đầu ngay</button>
          <button className="btn about-btn">Tìm hiểu thêm</button>
        </div>
      </header>
    </div>
  );
};

export default LandingPage;  // Đảm bảo bạn export component này
