/* 기능: 라우팅(페이지 연결) - Layout 적용 버전 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import RecordPage from './pages/RecordPage'; // 기록 작성 페이지
import CsLogPage from './pages/CsLogPage';
import AlgorithmPage from './pages/AlgorithmPage';
import ProjectPage from './pages/ProjectPage';
import TroubleshootPage from './pages/TroubleshootPage';
import CalendarPage from './pages/CalendarPage';
import './App.css';

// ==== 로그인 필요한 페이지 보호 컴포넌트 ====
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ==== 이미 로그인된 사용자 리다이렉트 컴포넌트 ====
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

// ==== Layout으로 감싼 보호된 라우트 ====
const ProtectedWithLayout = ({ children }) => {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* 공개 라우트 (로그인/회원가입) - Layout 없음 */}
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

      {/* 보호된 라우트 (Layout 포함) */}
      <Route
        path="/"
        element={
          <ProtectedWithLayout>
            <DashboardPage />
          </ProtectedWithLayout>
        }
      />
      <Route
        path="/record"
        element={
          <ProtectedWithLayout>
            <RecordPage />
          </ProtectedWithLayout>
        }
      />
      <Route
        path="/cs-logs"
        element={
          <ProtectedWithLayout>
            <CsLogPage />
          </ProtectedWithLayout>
        }
      />
      <Route
        path="/algorithms"
        element={
          <ProtectedWithLayout>
            <AlgorithmPage />
          </ProtectedWithLayout>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedWithLayout>
            <ProjectPage />
          </ProtectedWithLayout>
        }
      />
      <Route
        path="/troubleshoots"
        element={
          <ProtectedWithLayout>
            <TroubleshootPage />
          </ProtectedWithLayout>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedWithLayout>
            <CalendarPage />
          </ProtectedWithLayout>
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
