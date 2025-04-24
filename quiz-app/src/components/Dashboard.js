import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUsers, FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import './AdminDashboard.css';
import QuestionManager from "./QuestionManager";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [keyword, setKeyword] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const navigate = useNavigate();

  // Kiểm tra nếu chưa đăng nhập thì chuyển về trang login
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    axios.get("http://localhost/WEBQUIZZ/Chucnang/dashboard_data.php")
      .then(res => setData(res.data))
      .catch(err => console.error("Lỗi khi tải dashboard data:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Tìm kiếm câu hỏi dựa trên từ khóa và môn học
  const handleSearch = (e) => {
    e.preventDefault();

    axios.get('http://localhost/WEBQUIZZ/chucnang/search_cauhoi.php', {
      params: {
        keyword: keyword,
        subject: subjectFilter
      }
    })
    .then(res => {
      if (res.data.success) {
        setFilteredQuestions(res.data.data); // Cập nhật danh sách câu hỏi
      } else {
        alert('Không có câu hỏi nào phù hợp');
        setFilteredQuestions([]); // Xóa danh sách nếu không có kết quả
      }
    })
    .catch(err => {
      console.error("Lỗi tìm kiếm:", err);
      alert('Lỗi khi tìm kiếm');
    });
  };

  const barChartData = [
    { name: 'CN', điểm: 65 },
    { name: 'T2', điểm: 75 },
    { name: 'T3', điểm: 60 },
    { name: 'T4', điểm: 80 },
    { name: 'T5', điểm: 70 },
    { name: 'T6', điểm: 90 },
    { name: 'T7', điểm: 85 },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1>Admin Panel</h1>
        <ul>
          <li className={currentPage === "dashboard" ? "active" : ""} onClick={() => setCurrentPage("dashboard")}>Dashboard</li>
          <li className={currentPage === "questions" ? "active" : ""} onClick={() => setCurrentPage("questions")}>Quản lý câu hỏi</li>
        </ul>
        <button className="logout-btnn" onClick={handleLogout}>Đăng xuất</button>
      </aside>

      {/* Main Content */}
      <main className="main">
        {currentPage === "dashboard" && (
          <>
            <h1 className="welcome-text">Chào mừng trở lại!</h1>
            {/* Search Form */}
            <form onSubmit={handleSearch} className="search-form">
              <select 
                value={subjectFilter} 
                onChange={(e) => setSubjectFilter(e.target.value)} 
                className="subject-filter"
              >
                <option value="">Tất cả môn học</option>
                <option value="Toán">Toán</option>
                <option value="Khoa học">Khoa học</option>
                <option value="Lịch sử">Lịch sử</option>
              </select>
              <button type="submit" className="search-btn">Tìm kiếm</button>
            </form>

            {/* Display Filtered Questions */}
            {filteredQuestions.length > 0 && (
              <div className="question-list">
                <h3 className="text-lg font-bold mb-4">Danh sách câu hỏi:</h3>
                <ul>
                  {filteredQuestions.map((question, index) => (
                    <li key={index} className="question-item">
                      {question.content} {/* Hiển thị nội dung câu hỏi */}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Statistic Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="stat-card pink">
                <div>
                  <p className="stat-title">Người dùng</p>
                  <p className="stat-value">{data.users}</p>
                </div>
                <FiUsers className="stat-icon" />
              </div>
              <div className="stat-card indigo">
                <div>
                  <p className="stat-title">Câu hỏi</p>
                  <p className="stat-value">{data.cauhoi}</p>
                </div>
                <FiFileText className="stat-icon" />
              </div>
              <div className="stat-card green">
                <div>
                  <p className="stat-title">Chào Admin 👋</p>
                  <p className="text-sm">Chúc bạn một ngày làm việc hiệu quả!</p>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
              <div className="dashboard-card bg-white p-4 rounded-lg shadow col-span-2">
                <h3 className="text-lg font-bold mb-2">Thống kê điểm trong tuần</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="điểm" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {currentPage === "questions" && (
          <div className="bg-white p-6 rounded-lg shadow">
            {/* Quản lý câu hỏi */}
            <QuestionManager filteredQuestions={filteredQuestions} />
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
