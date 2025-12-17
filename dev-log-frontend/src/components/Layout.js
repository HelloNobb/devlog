/* 공통 레이아웃 컴포넌트 - 모든 페이지를 감싸는 구조 */
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="layout">
            {/* 헤더 */}
            <header className="layout-header">
                <div className="header-content">
                    <h1 className="logo">DevLog 📝</h1>
                    <p className="subtitle">개발자 역량 트래킹 플랫폼</p>
                </div>
            </header>

            {/* 탭 네비게이션 */}
            <nav className="tab-navigation">
                <NavLink
                    to="/"
                    className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}
                    end
                >
                    📊 대시보드
                </NavLink>
                <NavLink
                    to="/algorithms"
                    className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}
                >
                    💻 알고리즘
                </NavLink>
                <NavLink
                    to="/projects"
                    className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}
                >
                    🛠️ 프로젝트
                </NavLink>
                <NavLink
                    to="/troubleshoots"
                    className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}
                >
                    🔧 트러블슈팅
                </NavLink>
                <NavLink
                    to="/cs-logs"
                    className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}
                >
                    📚 CS개념
                </NavLink>
                <NavLink
                    to="/calendar"
                    className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`}
                >
                    📅 캘린더
                </NavLink>
                <button className="logout-btn" onClick={handleLogout}>
                    로그아웃
                </button>
            </nav>

            {/* 메인 콘텐츠 */}
            <main className="layout-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
