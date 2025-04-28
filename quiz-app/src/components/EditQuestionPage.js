import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './EditQuestion.css';

const EditQuestionPage = () => {
  const { questionId } = useParams(); // Lấy mã câu hỏi từ URL
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [question, setQuestion] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [answers, setAnswers] = useState({
    A: '',
    B: '',
    C: '',
    D: '',
    correct: 'A',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectsRes = await axios.get('http://localhost/WEBQUIZZ/Chucnang/get_monhoc.php');
        if (subjectsRes.data.success) {
          setSubjects(subjectsRes.data.data);
        } else {
          alert('Lỗi tải môn học');
        }

        const questionRes = await axios.get(`http://localhost/WEBQUIZZ/Chucnang/lay_cauhoi.php?id=${questionId}`);
        
        if (questionRes.data.success) {
          const data = questionRes.data.data;
          setQuestion(data.noidung);
          setDifficulty(data.dokho);
          setSubject(data.mamonhoc);
          setChapter(data.machuong);

          // Cập nhật đáp án từ API
          setAnswers({
            A: data.answerA || '',
            B: data.answerA || '',  // Placeholder: If only one answer, set others to A
            C: data.answerA || '',
            D: data.answerA || '',
            correct: data.correctAnswer === 1 ? 'A' : data.correctAnswer === 2 ? 'B' : data.correctAnswer === 3 ? 'C' : 'D',
          });
        } else {
          alert('Câu hỏi không tồn tại');
          navigate('/question-manager'); // Điều hướng về trang quản lý câu hỏi nếu không tìm thấy
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
        alert('Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false); // Kết thúc trạng thái tải
      }
    };

    fetchData();
  }, [questionId, navigate]);

  useEffect(() => {
    if (subject) {
      axios.get(`http://localhost/WEBQUIZZ/Chucnang/get_chapters.php?subject=${subject}`)
        .then(res => {
          if (res.data.success) {
            setChapters(res.data.data);
          } else {
            alert('Lỗi khi tải chương');
          }
        })
        .catch(err => {
          console.error('Lỗi khi tải chương:', err);
          alert('Lỗi khi tải chương');
        });
    }
  }, [subject]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      macauhoi: questionId,
      noidung: question,
      dokho: difficulty,
      mamonhoc: subject,
      machuong: chapter,
      answers,
    };

    axios.post('http://localhost/WEBQUIZZ/Chucnang/update_cauhoi.php', data)
      .then(res => {
        if (res.data.success) {
          alert('Cập nhật câu hỏi thành công');
          navigate('/question-manager');
        } else {
          alert('Cập nhật câu hỏi thất bại');
        }
      })
      .catch(err => {
        console.error('Lỗi khi cập nhật câu hỏi:', err);
        alert('Lỗi khi cập nhật câu hỏi');
      });
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>; // Hiển thị khi đang tải dữ liệu
  }

  return (
    <div className="edit-question-container">
      <h2>Sửa Câu Hỏi</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Câu Hỏi:</label>
          <textarea 
            value={question || ''} 
            onChange={(e) => setQuestion(e.target.value)} 
            required 
            placeholder="Nhập câu hỏi tại đây" 
          />
        </div>
        <div>
          <label>Độ Khó:</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required>
            <option value={1}>Dễ</option>
            <option value={2}>Trung Bình</option>
            <option value={3}>Khó</option>
          </select>
        </div>
        <div>
          <label>Môn Học:</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} required>
            <option value="">Chọn Môn Học</option>
            {subjects.map(s => (
              <option key={s.mamonhoc} value={s.mamonhoc}>
                {s.tenmonhoc}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Chương:</label>
          <select value={chapter} onChange={(e) => setChapter(e.target.value)} required>
            <option value="">Chọn Chương</option>
            {chapters.map(c => (
              <option key={c.machuong} value={c.machuong}>
                {c.tenchuong}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Đáp án A:</label>
          <input 
            type="text" 
            value={answers.A || ''} 
            onChange={(e) => setAnswers({ ...answers, A: e.target.value })} 
            required 
            placeholder="Nhập đáp án A" 
          />
        </div>
        <div>
          <label>Đáp án B:</label>
          <input 
            type="text" 
            value={answers.B || ''} 
            onChange={(e) => setAnswers({ ...answers, B: e.target.value })} 
            required 
            placeholder="Nhập đáp án B" 
          />
        </div>
        <div>
          <label>Đáp án C:</label>
          <input 
            type="text" 
            value={answers.C || ''} 
            onChange={(e) => setAnswers({ ...answers, C: e.target.value })} 
            required 
            placeholder="Nhập đáp án C" 
          />
        </div>
        <div>
          <label>Đáp án D:</label>
          <input 
            type="text" 
            value={answers.D || ''} 
            onChange={(e) => setAnswers({ ...answers, D: e.target.value })} 
            required 
            placeholder="Nhập đáp án D" 
          />
        </div>
        <div>
          <label>Đáp án Đúng:</label>
          <select value={answers.correct} onChange={(e) => setAnswers({ ...answers, correct: e.target.value })} required>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
        <button type="submit">Cập Nhật Câu Hỏi</button>
      </form>
    </div>
  );
};

export default EditQuestionPage;
