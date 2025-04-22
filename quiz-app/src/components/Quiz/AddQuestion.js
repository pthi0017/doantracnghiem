import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './AddQuestion.module.css'; // Import CSS Module

const AddQuestionPage = () => {
  const [question, setQuestion] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [newChapterName, setNewChapterName] = useState('');
  const [subjects, setSubjects] = useState([]);  // State to store subjects
  const [chapters, setChapters] = useState([]);
  const [answers, setAnswers] = useState({
    A: '',
    B: '',
    C: '',
    D: '',
    correct: 'A',
  });
  const navigate = useNavigate();

  // Load subjects from API
  useEffect(() => {
    axios.get('http://localhost/WEBQUIZZ/chucnang/get_subjects_for_add.php')
      .then(res => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setSubjects(res.data.data); // Save subjects to state
        } else {
          setSubjects([]);
          alert('Error loading subjects');
        }
      })
      .catch(err => {
        setSubjects([]);
        alert('Error loading subjects');
      });
  }, []);

  // Load chapters based on selected subject
  useEffect(() => {
    if (subject) {
      axios.get(`http://localhost/WEBQUIZZ/chucnang/get_chapters.php?subject=${subject}`)
        .then(res => {
          if (res.data.success) {
            setChapters(res.data.data); // Save chapters to state
          } else {
            alert('Lỗi tải chương');
          }
        });
    }
  }, [subject]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      question,
      difficulty,
      subject,
      chapter: chapter || newChapterName, // Use selected chapter or new chapter name
      answers,
    };

    // If new chapter name is entered, create new chapter first
    if (newChapterName) {
      axios.post('http://localhost/WEBQUIZZ/chucnang/add_chapter.php', { subject, newChapterName })
        .then(response => {
          if (response.data.success) {
            alert('Tạo chương thành công');
            saveQuestion(data);
          } else {
            alert('Tạo chương thất bại');
          }
        });
    } else {
      saveQuestion(data);
    }
  };

  const saveQuestion = (data) => {
    axios.post('http://localhost/WEBQUIZZ/chucnang/add_cauhoi.php', data)
      .then(res => {
        if (res.data.success) {
          alert('Tạo câu hỏi thành công');
          navigate('/dashboard'); // Điều hướng về trang dashboard sau khi tạo câu hỏi thành công
        } else {
          alert('Tạo câu hỏi thất bại');
        }
      });
  };

  return (
    <div className={styles.addQuestionPage}>
      <h1 className={styles.header}>Thêm Câu Hỏi</h1>
      <form className={styles.addQuestionForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="question">Câu Hỏi</label>
          <textarea id="question" value={question} onChange={(e) => setQuestion(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="difficulty">Độ Khó</label>
          <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required>
            <option value={1}>Dễ</option>
            <option value={2}>Trung Bình</option>
            <option value={3}>Khó</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="subject">Môn Học</label>
          <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required>
            <option value="">Chọn Môn Học</option>
            {subjects.map((s) => (
              <option key={s.mamonhoc} value={s.mamonhoc}>
                {s.tenmonhoc} (Đề thi: {s.so_de_thi})
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="chapter">Chương</label>
          <select id="chapter" value={chapter} onChange={(e) => setChapter(e.target.value)} required>
            <option value="">Chọn Chương</option>
            {chapters.map((c) => (
              <option key={c.machuong} value={c.machuong}>
                {c.tenchuong}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => navigate(`/add-chapter/${subject}`)}>
            Thêm chương mới
          </button>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="answerA">Đáp án A</label>
          <input id="answerA" type="text" value={answers.A} onChange={(e) => setAnswers({ ...answers, A: e.target.value })} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="answerB">Đáp án B</label>
          <input id="answerB" type="text" value={answers.B} onChange={(e) => setAnswers({ ...answers, B: e.target.value })} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="answerC">Đáp án C</label>
          <input id="answerC" type="text" value={answers.C} onChange={(e) => setAnswers({ ...answers, C: e.target.value })} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="answerD">Đáp án D</label>
          <input id="answerD" type="text" value={answers.D} onChange={(e) => setAnswers({ ...answers, D: e.target.value })} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="correctAnswer">Đáp án đúng</label>
          <select id="correctAnswer" value={answers.correct} onChange={(e) => setAnswers({ ...answers, correct: e.target.value })} required>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
        <div className={styles.formActions}>
          <button type="submit" className={styles.submitBtn}>Thêm Câu Hỏi</button>
          <button type="button" className={styles.backBtn} onClick={() => navigate('/dashboard')}>Trở về Dashboard</button>
        </div>
      </form>
    </div>
  );
};

export default AddQuestionPage;
