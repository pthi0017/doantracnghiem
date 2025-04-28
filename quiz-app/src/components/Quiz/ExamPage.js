import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ExamPage.css';

const ExamPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subjectName, setSubjectName] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const [questionsRes, subjectRes] = await Promise.all([
          axios.get(`http://localhost/WEBQUIZZ/Chucnang/lam_bai.php?mamonhoc=${subjectId}`),
          axios.get(`http://localhost/WEBQUIZZ/Chucnang/get_subjects.php?mamonhoc=${subjectId}`)
        ]);

        if (questionsRes.data.success && questionsRes.data.questions?.length > 0) {
          setQuestions(questionsRes.data.questions);
          setSubjectName(subjectRes.data?.tenmonhoc || '');
        } else {
          setError(questionsRes.data.error || "Không có câu hỏi nào.");
        }
      } catch (err) {
        setError("Lỗi tải câu hỏi.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [subjectId]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      const selected = selectedAnswers[q.macauhoi];
      const correctAns = q.answers.find(a => a.ladapan)?.macautl;
      if (selected === correctAns) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleSubmit = () => {
    const score = calculateScore();
    navigate(`/result/${subjectId}`, {
      state: {
        score,
        totalQuestions: questions.length,
        correctAnswers: Math.round((score / 100) * questions.length),
        subjectName
      }
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="loading">Đang tải câu hỏi...</div>;
  if (error) return <div className="error">{error}</div>;
  if (questions.length === 0) return <div className="error">Không có câu hỏi.</div>;

  const currentQ = questions[currentQuestion];

  const alphabet = ['A', 'B', 'C', 'D']; // Answer options as A, B, C, D

  return (
    <div className="exam-container">
      <header className="exam-header">
        <h2>Môn: {subjectName}</h2>
        <div className="timer">Thời gian: {formatTime(timeLeft)}</div>
      </header>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="question-card">
        <div className="question-number">
          Câu {currentQuestion + 1}/{questions.length}
        </div>
        <h3 className="question-text">{currentQ.noidung}</h3>

        <div className="answers-list">
          {currentQ.answers.map((answer, index) => (
            <label key={answer.macautl} className="answer-btn">
              <input
                type="radio"
                name={`question-${currentQ.macauhoi}`}
                value={answer.macautl}
                checked={selectedAnswers[currentQ.macauhoi] === answer.macautl}
                onChange={() => handleAnswerSelect(currentQ.macauhoi, answer.macautl)}
              />
              <span className="answer-letter">{alphabet[index]}:</span> <span className="answer-text">{answer.noidungtl}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="navigation-buttons">
        <button
          className="nav-btn prev-btn"
          onClick={handlePrevQuestion}
          disabled={currentQuestion === 0}
        >
          ← Câu trước
        </button>

        {currentQuestion < questions.length - 1 ? (
          <button className="nav-btn next-btn" onClick={handleNextQuestion}>
            Câu tiếp → 
          </button>
        ) : (
          <button className="nav-btn submit-btn" onClick={handleSubmit}>
            Nộp bài
          </button>
        )}
      </div>
    </div>
  );
};

export default ExamPage;
