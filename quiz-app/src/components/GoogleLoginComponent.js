// src/components/GoogleLoginComponent.js
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';  // Nhập GoogleLogin

const GoogleLoginComponent = () => {
  const handleLogin = (response) => {
    console.log('Google login response:', response);
    // Gửi token Google lên backend của bạn để xác thực
    fetch('http://localhost/WEBQUIZZ/Chucnang/google-login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: response.credential }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        console.log('Đăng nhập thành công', data);
        // Xử lý đăng nhập thành công (ví dụ: lưu thông tin người dùng vào localStorage)
      } else {
        console.log('Đăng nhập thất bại');
      }
    })
    .catch(err => console.error('Lỗi khi gọi API', err));
  };

  return (
    <div>
      <h3>Đăng nhập với Google</h3>
      <GoogleLogin
        onSuccess={handleLogin}  // Xử lý khi đăng nhập thành công
        onError={() => console.log('Đăng nhập thất bại')}  // Xử lý khi đăng nhập thất bại
      />
    </div>
  );
};

export default GoogleLoginComponent;
