import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHome, FaEnvelope, FaSignInAlt, FaUser, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch subjects and user info
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get("http://localhost/WEBQUIZZ/Chucnang/subjects_list.php");
        if (response.data.success) {
          setSubjects(response.data.data);
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách môn học:", err);
      }
    };

    fetchSubjects();

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);  // Set user info after login
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const handleSubjectSelect = (subjectId) => {
    setSelectedSubject(subjectId);
    navigate(`/exam/${subjectId}`);
  };

  // Toggle dropdown visibility
  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="homepage-container">
      <nav className="homepage-nav">
        <ul className="menu">
          <li>
            <button className="menu-btn" onClick={() => navigate("/")}>
              <FaHome /> Trang chủ
            </button>
          </li>
          <li>
            <button className="menu-btn" onClick={() => navigate("/contact")}>
              <FaEnvelope /> Liên hệ
            </button>
          </li>
          <li className="dropdown">
            <button className="menu-btn" onClick={handleDropdownToggle}>
              Luyện thi <FaChevronDown size={12} />
            </button>
            {showDropdown && (
              <ul className="dropdown-menu">
                {subjects.map((subject) => (
                  <li key={subject.mamonhoc}>
                    <button
                      className="dropdown-item"
                      onClick={() => handleSubjectSelect(subject.mamonhoc)}
                    >
                      {subject.tenmonhoc}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li>
            {user ? (
              <div className="user-menu">
                <img src={user.avatar} alt="User Avatar" className="user-avatar" />
                <span>{user.name}</span>
                {showDropdown && (
                  <ul className="user-dropdown">
                    <li>
                      <button className="dropdown-item" onClick={() => navigate("/edit-user")}>
                        <FaUser /> Thông tin cá nhân
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <FaSignOutAlt /> Đăng xuất
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <button className="menu-btn" onClick={() => navigate("/login")}>
                <FaSignInAlt /> Đăng nhập
              </button>
            )}
          </li>
        </ul>
      </nav>

      <header className="homepage-header">
        <h1>Hệ Thống Ôn Luyện Thi Trắc Nghiệm</h1>
        <p>Nền tảng ôn luyện trực tuyến giúp bạn chuẩn bị tốt nhất cho các kỳ thi quan trọng.</p>
        <div className="subject-select">
          <label>Chọn môn thi bạn muốn ôn luyện:</label>
          {subjects.length > 0 ? (
            <div className="subject-options">
              {subjects.map((subject) => (
                <div
                  key={subject.mamonhoc}
                  className={`subject-option ${selectedSubject === subject.mamonhoc ? 'selected' : ''}`}
                  onClick={() => setSelectedSubject(subject.mamonhoc)}
                >
                  <input
                    type="radio"
                    id={`subject-${subject.mamonhoc}`}
                    name="subject"
                    value={subject.mamonhoc}
                    checked={selectedSubject === subject.mamonhoc}
                    onChange={() => setSelectedSubject(subject.mamonhoc)}
                  />
                  <label htmlFor={`subject-${subject.mamonhoc}`}>{subject.tenmonhoc}</label>
                </div>
              ))}
            </div>
          ) : (
            <p>Hiện chưa có môn học nào</p>
          )}
        </div>
        <div className="homepage-buttons">
          <button
            className="btn start-btn"
            onClick={() => selectedSubject && navigate(`/exam/${selectedSubject}`)}
            disabled={!selectedSubject}
          >
            Bắt đầu thi ngay
          </button>
        </div>
      </header>
    </div>
  );
};

export default HomePage;
