import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute"; // Ensure PrivateRoute is implemented

// Components
import HomePage from "./components/HomePage";
// Auth routes
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
import ListUsers from "./components/Auth/ListUsers";
import EditUserPage from "./components/Auth/EditUserPage";
// Quiz routes
import AddQuestion from "./components/Quiz/AddQuestion";
import AddChapterPage from "./components/Quiz/AddChapterPage";
import ResultPage from "./components/Quiz/ResultPage";
import ExamPage from "./components/Quiz/ExamPage";
import EditQuestionPage from "./components/EditQuestionPage";
import QuestionManager from "./components/QuestionManager";
// Practice routes
import PracticeMode from "./components/Practice/PracticeMode";
// Admin routes
import AdminDashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";

// 404 Page
const NotFound = () => <h2 className="text-center mt-10 text-2xl text-red-500">404 - Không tìm thấy trang</h2>;

function App() {
  return (
    <div className="min-h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />  {/* Trang chủ */}
          
          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/users" element={<ListUsers />} />
          <Route path="edit-user" element={<EditUserPage />} />

          {/* Quiz routes */}
          <Route path="/add-question" element={<AddQuestion />} />
          <Route path="/add-chapter/:subjectId" element={<AddChapterPage />} />
          <Route path="/result/:subjectId" element={<ResultPage />} />
          <Route path="/exam/:subjectId" element={<ExamPage />} />
          <Route path="/edit-question/:questionId" element={<EditQuestionPage />} />

          {/* Admin Dashboard */}
          <Route path="/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />

          {/* Question Manager */}
          <Route path="/question-manager" element={<PrivateRoute><QuestionManager /></PrivateRoute>} />

          {/* Practice routes */}
          <Route path="/practice-mode" element={<PracticeMode />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
