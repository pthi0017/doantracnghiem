import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultPage.css';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { score, totalQuestions, correctAnswers, subjectName } = location.state || {};

  const handleRetry = () => {
    navigate(`/exam/${subjectName.toLowerCase()}`); // Redirect to the exam page for the same subject
  };

  return (
    <div className="result-container">
      <nav className="result-nav">
        <button className="menu-btn" onClick={() => navigate("/homepage")}>Trang chủ</button>
        <button className="menu-btn" onClick={() => navigate("/contact")}>Liên hệ</button>
      </nav>

      <header className="result-header">
        <h2 className="result-title">Kết quả thi môn: {subjectName}</h2>
        <div className="result-score">
          <h3>Điểm: {score}%</h3>
          <p>Số câu đúng: {correctAnswers}/{totalQuestions}</p>
        </div>
      </header>

      <div className="result-actions">
        <button className="retry-btn" onClick={handleRetry}>Làm lại bài thi</button>
      </div>
    </div>
  );
};

export default ResultPage;
