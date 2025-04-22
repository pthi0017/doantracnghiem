import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from './EditUserPage.module.css';  // Import CSS Module

// Cấu hình axios với withCredentials
const api = axios.create({
  baseURL: 'http://localhost/WEBQUIZZ/Chucnang/', // Đảm bảo đây là đúng đường dẫn tới backend của bạn
  withCredentials: true, // Đảm bảo gửi cookie và session
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

const EditUserPage = () => {
  const [user, setUser] = useState({
    hoten: '',
    email: '',
    sodienthoai: '',
    gioitinh: '', // Để mặc định là một chuỗi trống, sẽ cập nhật từ backend
    ngaysinh: '',
    avatar: ''  // Đảm bảo avatar được xử lý đúng
  });
  const [previewAvatar, setPreviewAvatar] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Sử dụng useEffect để tải thông tin người dùng từ backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("get_user.php"); // Gửi yêu cầu đến backend để lấy thông tin người dùng
        if (response.data.success) {
          setUser({
            hoten: response.data.user.hoten || '',
            email: response.data.user.email || '',
            sodienthoai: response.data.user.sodienthoai || '',
            gioitinh: response.data.user.gioitinh !== null ? response.data.user.gioitinh.toString() : '', // Giữ nguyên giá trị từ backend
            ngaysinh: response.data.user.ngaysinh || '',
            avatar: response.data.user.avatar || ''
          });
          setPreviewAvatar(response.data.user.avatar ? `http://localhost/WEBQUIZZ/Chucnang/${response.data.user.avatar}` : '');  // Cập nhật đường dẫn ảnh
          localStorage.setItem("user", JSON.stringify(response.data.user)); // Lưu thông tin người dùng vào localStorage
        } else {
          navigate("/login"); // Nếu không có dữ liệu, điều hướng về trang đăng nhập
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", err);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  // Hàm xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý thay đổi ảnh đại diện
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser(prev => ({ ...prev, avatar: file }));
      setPreviewAvatar(URL.createObjectURL(file));  // Hiển thị ảnh đại diện trước khi upload
    }
  };

  // Hàm xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("hoten", user.hoten || '');  // Đảm bảo có giá trị mặc định
    formData.append("email", user.email || '');  // Đảm bảo có giá trị mặc định
    formData.append("sodienthoai", user.sodienthoai || '');  // Đảm bảo có giá trị mặc định
    formData.append("gioitinh", user.gioitinh || '');  // Đảm bảo có giá trị mặc định từ backend
    formData.append("ngaysinh", user.ngaysinh || '');  // Đảm bảo có giá trị mặc định
    if (user.avatar instanceof File) {
      formData.append("avatar", user.avatar);  // Thêm file ảnh vào formData nếu có
    }

    try {
      const response = await api.post("update_user.php", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        // Lưu thông tin người dùng vào localStorage sau khi cập nhật thành công
        localStorage.setItem("user", JSON.stringify(response.data.user));  
        setTimeout(() => navigate("/homepage"), 1500); // Điều hướng đến trang homepage
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      alert("Lỗi khi cập nhật thông tin");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm quay lại trang homepage
  const goBack = () => {
    navigate("/homepage");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Chỉnh sửa thông tin cá nhân</h2>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Email:</label>
          <p className={styles.emailDisplay}>{user.email}</p> {/* Hiển thị email với màu mới */}
        </div>
        <div className={styles.formGroup}>
          <label>Họ và tên:</label>
          <input
            className={styles.input}
            type="text"
            name="hoten"
            value={user.hoten || ''}
            onChange={handleChange}
            placeholder="Họ và tên"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Số điện thoại:</label>
          <input
            className={styles.input}
            type="tel"
            name="sodienthoai"
            value={user.sodienthoai || ''}
            onChange={handleChange}
            placeholder="Số điện thoại"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Ngày sinh:</label>
          <input
            className={styles.input}
            type="date"
            name="ngaysinh"
            value={user.ngaysinh || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Giới tính:</label>
          <select className={styles.input} name="gioitinh" value={user.gioitinh || ''} onChange={handleChange}>
            <option value="1">Nam</option>
            <option value="0">Nữ</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>Avatar:</label>
          {previewAvatar && <img className={styles.avatarPreview} src={previewAvatar} alt="Avatar Preview" />}
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>
        <button className={styles.submitBtn} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
        <button className={styles.backButton} onClick={goBack}>Trở về trang chủ</button>
      </form>
    </div>
  );
};

export default EditUserPage;
