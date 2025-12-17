/* 기능: 라우팅(페이지 연결) */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CsLogPage from './pages/CsLogPage'; // CS 학습 페이지 추가
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
      <Route
        path="/algorithms"
        element={
          <ProtectedRoute>
            <div style={{ padding: '40px', color: 'white', background: '#0f0f23', minHeight: '100vh' }}>
              <h1>💻 알고리즘 페이지</h1>
              <p>구현 예정</p>
              <a href="/" style={{ color: '#6366f1' }}>← 대시보드로 돌아가기</a>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <div style={{ padding: '40px', color: 'white', background: '#0f0f23', minHeight: '100vh' }}>
              <h1>🛠️ 프로젝트 페이지</h1>
              <p>구현 예정</p>
              <a href="/" style={{ color: '#6366f1' }}>← 대시보드로 돌아가기</a>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/troubleshoots"
        element={
          <ProtectedRoute>
            <div style={{ padding: '40px', color: 'white', background: '#0f0f23', minHeight: '100vh' }}>
              <h1>🔧 트러블슈팅 페이지</h1>
              <p>구현 예정</p>
              <a href="/" style={{ color: '#6366f1' }}>← 대시보드로 돌아가기</a>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <div style={{ padding: '40px', color: 'white', background: '#0f0f23', minHeight: '100vh' }}>
              <h1>📅 캘린더 페이지</h1>
              <p>구현 예정</p>
              <a href="/" style={{ color: '#6366f1' }}>← 대시보드로 돌아가기</a>
            </div>
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
