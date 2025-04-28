import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaEdit } from 'react-icons/fa'; // Thêm icon "Sửa"
import { useNavigate } from 'react-router-dom';
import './QuestionManager.css';

const QuestionManager = () => {
  const [questions, setQuestions] = useState([]); // Danh sách câu hỏi
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [keyword, setKeyword] = useState(''); // Từ khóa tìm kiếm
  const [subject, setSubject] = useState(''); // Môn học
  const [subjects, setSubjects] = useState([]); // Danh sách môn học
  const navigate = useNavigate();

  // Tải danh sách môn học
  useEffect(() => {
    axios.get('http://localhost/WEBQUIZZ/Chucnang/get_monhoc.php')
      .then(res => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setSubjects(res.data.data);
        } else {
          console.error('Dữ liệu môn học không hợp lệ:', res.data);
          alert('Không thể tải danh sách môn học.');
        }
      })
      .catch(err => {
        console.error('Lỗi khi tải danh sách môn học:', err);
        alert('Lỗi khi tải danh sách môn học.');
      });
  }, []);

  // Tải câu hỏi khi thay đổi từ khóa hoặc môn học
  useEffect(() => {
    setLoading(true);
    const params = {};

    if (keyword) params.keyword = keyword.trim(); // Thêm từ khóa vào params
    if (subject) params.subject = subject; // Thêm môn học vào params

    console.log('Params gửi đến API:', params);

    axios.get('http://localhost/WEBQUIZZ/Chucnang/get_cauhoi.php', { params })
      .then(res => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setQuestions(res.data.data); // Cập nhật danh sách câu hỏi
        } else {
          console.error('Dữ liệu câu hỏi không hợp lệ:', res.data);
          alert(res.data.message || 'Không tìm thấy câu hỏi.');
          setQuestions([]); // Nếu không có câu hỏi, set danh sách câu hỏi là rỗng
        }
      })
      .catch(err => {
        console.error('Lỗi khi tải câu hỏi:', err);
        alert('Lỗi khi tải câu hỏi. Vui lòng thử lại sau.');
        setQuestions([]); // Nếu có lỗi, set danh sách câu hỏi là rỗng
      })
      .finally(() => {
        setLoading(false); // Đặt loading thành false sau khi tải xong
      });
  }, [keyword, subject]);

  // Xóa câu hỏi
  const deleteQuestion = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa câu hỏi này không?')) {
      axios.get(`http://localhost/WEBQUIZZ/Chucnang/delete_cauhoi.php?id=${id}`)
        .then(res => {
          if (res.data.status === 'success') {
            alert('Câu hỏi đã được xóa thành công.');
            setQuestions(prev => prev.filter(q => q.macauhoi !== id)); // Xóa câu hỏi khỏi danh sách
          } else {
            alert('Xóa thất bại: ' + (res.data.message || 'Lỗi không xác định'));
          }
        })
        .catch(err => {
          console.error('Lỗi khi xóa câu hỏi:', err);
          alert('Lỗi khi xóa câu hỏi.');
        });
    }
  };

  // Thêm câu hỏi
  const addQuestion = () => {
    navigate('/add-question');  // Điều hướng đến trang thêm câu hỏi
  };

  // Sửa câu hỏi
  const editQuestion = (id) => {
    navigate(`/edit-question/${id}`);  // Điều hướng đến trang sửa câu hỏi
  };

  return (
    <div className="question-manager">
      <h2>Quản lý câu hỏi</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Tìm theo câu hỏi..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)} // Lọc theo từ khóa
        />
        <select 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)} // Lọc theo môn học
        >
          <option value="">Tất cả môn học</option>
          {subjects.map((s) => (
            <option key={s.mamonhoc} value={s.mamonhoc}>
              {s.tenmonhoc}
            </option>
          ))}
        </select>
      </div>

      <button onClick={addQuestion} className="add-question-btn">
        Thêm câu hỏi
      </button>

      {loading ? (
        <div>Đang tải câu hỏi...</div> // Hiển thị khi đang tải
      ) : (
        <table className="question-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nội dung</th>
              <th>Độ khó</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {questions.length > 0 ? (
              questions.map((question) => (
                <tr key={question.macauhoi}>
                  <td>{question.macauhoi}</td>
                  <td>{question.noidung}</td>
                  <td>{question.dokho}</td>
                  <td>
                    <button
                      onClick={() => deleteQuestion(question.macauhoi)} // Xóa câu hỏi
                      className="delete-btn"
                      aria-label="Xóa câu hỏi"
                    >
                      <FaTrashAlt />
                    </button>
                    <button
                      onClick={() => editQuestion(question.macauhoi)} // Sửa câu hỏi
                      className="edit-btn"
                      aria-label="Sửa câu hỏi"
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-questions">Không có câu hỏi nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QuestionManager;
