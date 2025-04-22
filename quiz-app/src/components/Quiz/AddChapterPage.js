import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const AddChapterPage = () => {
  const [newChapterName, setNewChapterName] = useState('');
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const handleAddChapter = async (e) => {
    e.preventDefault();

    if (!newChapterName.trim()) {
      alert('Vui lòng nhập tên chương');
      return;
    }

    if (newChapterName.length > 100) {
      alert('Tên chương không được vượt quá 100 ký tự');
      return;
    }

    try {
      const response = await axios.post('http://localhost/WEBQUIZZ/chucnang/add_chapter.php', {
        subject: subjectId,
        newChapterName,
      });

      if (response.data.success) {
        alert('Thêm chương thành công!');
        navigate(`/add-question`);
      } else {
        // Hiển thị chi tiết thông báo lỗi từ backend
        alert('Thêm chương thất bại: ' + response.data.message);
      }
    } catch (error) {
      alert('Lỗi khi thêm chương. Vui lòng thử lại sau.');
      console.error('Error when adding chapter: ', error);
    }
  };

  const handleBack = () => {
    navigate(`/add-question`);
  };

  return (
    <div>
      <h1>Thêm Chương Mới</h1>
      <form onSubmit={handleAddChapter}>
        <div>
          <label>Tên Chương:</label>
          <input
            type="text"
            value={newChapterName}
            onChange={(e) => setNewChapterName(e.target.value)}
            placeholder="Nhập tên chương"
            required
          />
        </div>
        <button type="submit">Thêm Chương</button>
      </form>
      <button type="button" onClick={handleBack}>Trở về</button>
    </div>
  );
};

export default AddChapterPage;
