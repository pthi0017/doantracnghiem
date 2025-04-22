import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost/WEBQUIZZ/Chucnang/',
  withCredentials: true, // Đảm bảo gửi session cookie kèm theo yêu cầu
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

export default api;
