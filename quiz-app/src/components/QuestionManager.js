import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './QuestionManager.css';

const QuestionManager = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [subject, setSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();  // Use useNavigate hook

  // Load subjects
  useEffect(() => {
    axios.get('http://localhost/WEBQUIZZ/Chucnang/get_monhoc.php')
      .then(res => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setSubjects(res.data.data);
        } else {
          console.error('Invalid subject data:', res.data);
          alert('Could not load subjects.');
        }
      })
      .catch(err => {
        console.error('Error loading subjects:', err);
        alert('Error loading subjects.');
      });
  }, []);

  // Load questions when keyword or subject changes
  useEffect(() => {
    setLoading(true);
    const params = {};

    if (keyword) params.keyword = keyword;
    if (subject) params.subject = subject;

    axios.get('http://localhost/WEBQUIZZ/Chucnang/get_cauhoi.php', { params })
      .then(res => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setQuestions(res.data.data);
        } else {
          console.error('Invalid question data:', res.data);
          alert('No questions found.');
          setQuestions([]);
        }
      })
      .catch(err => {
        console.error('Error loading questions:', err);
        alert('Error loading questions.');
        setQuestions([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [keyword, subject]);

  const deleteQuestion = (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      axios.get(`http://localhost/WEBQUIZZ/Chucnang/delete_cauhoi.php?id=${id}`)
        .then(res => {
          if (res.data.status === 'success') {
            alert('Question deleted successfully.');
            setQuestions(prev => prev.filter(q => q.macauhoi !== id));
          } else {
            alert('Delete failed: ' + res.data.message);
          }
        })
        .catch(err => {
          console.error('Error deleting question:', err);
        });
    }
  };

  const addQuestion = () => {
    navigate('/add-question');  // Navigate to the Add Question page
  };

  return (
    <div className="question-manager">
      <h2>quản lí câu hỏi</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="tìm theo câu hỏi..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)}
        >
          <option value="">tất cả môn học</option>
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
        <div>Loading questions...</div>
      ) : (
        <table className="question-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Content</th>
              <th>Difficulty</th>
              <th>Actions</th>
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
                      onClick={() => deleteQuestion(question.macauhoi)}
                      className="delete-btn"
                      aria-label="Delete question"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-questions">No questions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QuestionManager;
