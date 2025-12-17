/* 기능: 라우팅(페이지 연결) */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CsLogPage from './pages/CsLogPage'; // CS 학습 페이지 추가
import AlgorithmPage from './pages/AlgorithmPage'; // 알고리즘 페이지 추가
import ProjectPage from './pages/ProjectPage'; // 프로젝트 페이지 추가
import TroubleshootPage from './pages/TroubleshootPage'; // 트러블슈팅 페이지 추가
import CalendarPage from './pages/CalendarPage'; // 캘린더 페이지 추가
import './App.css';

// ==== 로그인 필요한 페이지 보호 컴포넌트 ====
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!isAuthenticated) { // 로그인 안했으면, -> 로그인 페이지로 강제 이동
    return <Navigate to="/login" replace />;
  }

  return children; //로그인 했으면, -> 원래 페이지로 이동
};

// 이미 로그인된 사용자 리다이렉트 컴포넌트 ====
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* 공개 라우트 (로그인/회원가입) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />

      {/* 보호된 라우트 (로그인 필요) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* CS 학습 페이지 */}
      <Route
        path="/cs-logs"
        element={
          <ProtectedRoute>
            <CsLogPage />
          </ProtectedRoute>
        }
      />
      {/* 알고리즘 페이지 */}
      <Route
        path="/algorithms"
        element={
          <ProtectedRoute>
            <AlgorithmPage />
          </ProtectedRoute>
        }
      />
      {/* 프로젝트 페이지 */}
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <ProjectPage />
          </ProtectedRoute>
        }
      />
      {/* 트러블슈팅 페이지 */}
      <Route
        path="/troubleshoots"
        element={
          <ProtectedRoute>
            <TroubleshootPage />
          </ProtectedRoute>
        }
      />
      {/* 캘린더 페이지 */}
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        }
      />

      {/* 404 처리 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
