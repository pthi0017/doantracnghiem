import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";  // Giả sử bạn có một component PrivateRoute để bảo vệ các route cần login

// Các component
import HomePage from "./components/HomePage";
// Auth routes
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
import ListUsers from "./components/Auth/ListUsers";
import ResultPage from "./components/Quiz/ResultPage";
// Quiz routes
import AddQuestion from "./components/Quiz/AddQuestion";

import QuestionManager from "./components/QuestionManager";
import ExamPage from "./components/Quiz/ExamPage";
import AddExam from "./components/Quiz/AddExam";
import LandingPage from "./components/LandingPage";
import AddChapterPage from "./components/Quiz/AddChapterPage";

// Practice routes
import PracticeMode from "./components/Practice/PracticeMode";
import EditUserPage from "./components/Auth/EditUserPage";
// Admin routes
import AdminDashboard from './components/Dashboard';

// Trang 404
const NotFound = () => <h2 className="text-center mt-10 text-2xl text-red-500">404 - Không tìm thấy trang</h2>;

function App() {
  return (
    <div className="min-h-screen"> {/* Đảm bảo toàn trang cao bằng màn hình */}
      <Router>
        <Routes>
          <Route path="/homepage" element={<HomePage />} />  {/* Trang chủ */}
          
          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/users" element={<ListUsers />} />
          <Route path="edit-user"element={<EditUserPage/>}/>
          {/* Quiz routes */}
          <Route path="/add-question" element={<AddQuestion />} />
          <Route path="/add-chapter/:subjectId" element={<AddChapterPage />} />
          <Route path="/result/:subjectId" element={<ResultPage />} />
          <Route path="/exam/:subjectId" element={<ExamPage />} />
          <Route path="/add-exam" element={<AddExam />} />
          
          {/* Admin Dashboard (Protected by PrivateRoute) */}
          <Route path="/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} /> 
          <Route path="/"element={<LandingPage/>}/>
          {/* Các route quiz */}
  
      
         
          
          {/* Admin routes */}
          <Route path="/question-manager" element={<PrivateRoute><QuestionManager /></PrivateRoute>} />

          {/* Practice routes */}
          
          <Route path="/practice-mode" element={<PracticeMode />} />
   

          {/* Catch-all route for 404 page */}
          <Route path="*" element={<NotFound />} /> {/* Không tìm thấy trang */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
