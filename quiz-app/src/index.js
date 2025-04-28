// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';  // Import đúng từ React 18
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = '377298935619-9tdhcs43dgd96ufm8p7gsq4drcq7a0vg.apps.googleusercontent.com';  // Thay thế bằng Google Client ID của bạn

// Tạo root mới để render ứng dụng
const root = ReactDOM.createRoot(document.getElementById('root'));

// Bọc ứng dụng trong GoogleOAuthProvider và render ứng dụng
root.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
