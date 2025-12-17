import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const DashboardPage = () => {
    const { user, logout } = useAuth();

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="user-greeting">
                    <div className="profile-image">
                        {user?.name?.charAt(0) || '👤'}
                    </div>
                    <div className="greeting-text">
                        <span className="greeting">안녕하세요,</span>
                        <span className="username">{user?.name || '사용자'}님!</span>
                    </div>
                </div>
                <button className="logout-button" onClick={logout}>로그아웃</button>
            </header>

            <main className="dashboard-main">
                <section className="stats-section">
                    <h2>📊 이번 주 기록 현황</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <span className="stat-number">0</span>
                            <span className="stat-label">알고리즘 문제</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">0</span>
                            <span className="stat-label">CS 개념</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">0</span>
                            <span className="stat-label">연속 기록</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">0</span>
                            <span className="stat-label">누적 기록</span>
                        </div>
                    </div>
                </section>

                <section className="quick-links">
                    <h2>🚀 바로가기</h2>
                    <div className="links-grid">
                        <a href="/cs-logs" className="link-card">
                            <span className="link-icon">📚</span>
                            <span className="link-title">CS 학습</span>
                        </a>
                        <a href="/algorithms" className="link-card">
                            <span className="link-icon">💻</span>
                            <span className="link-title">알고리즘</span>
                        </a>
                        <a href="/projects" className="link-card">
                            <span className="link-icon">🛠️</span>
                            <span className="link-title">프로젝트</span>
                        </a>
                        <a href="/troubleshoots" className="link-card">
                            <span className="link-icon">🔧</span>
                            <span className="link-title">트러블슈팅</span>
                        </a>
                        <a href="/calendar" className="link-card">
                            <span className="link-icon">📅</span>
                            <span className="link-title">캘린더</span>
                        </a>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DashboardPage;
