/* 대시보드 페이지 - 주간 활동 현황 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAlgorithms } from '../api/algorithms';
import { getCsLogs } from '../api/csLogs';
import { getProjects } from '../api/projects';
import { getTroubleshoots } from '../api/troubleshoots';
import '../styles/Dashboard.css';

const DashboardPage = () => {
    const { user } = useAuth();
    const [weeklyStats, setWeeklyStats] = useState({
        algorithms: 0,
        projects: 0,
        troubleshoots: 0,
        csLogs: 0,
    });
    const [loading, setLoading] = useState(true);

    // ==== 이번 주 기록 개수 가져오기 ====
    useEffect(() => {
        fetchWeeklyStats();
    }, []);

    const fetchWeeklyStats = async () => {
        try {
            setLoading(true);

            // 이번 주 시작일 계산 (월요일 기준)
            const now = new Date();
            const dayOfWeek = now.getDay();
            const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() + mondayOffset);
            weekStart.setHours(0, 0, 0, 0);

            // 각 API에서 전체 목록 가져와서 이번 주 것만 필터링
            const [algoRes, csRes, projRes, troubleRes] = await Promise.all([
                getAlgorithms({ limit: 100 }),
                getCsLogs({ limit: 100 }),
                getProjects({ limit: 100 }),
                getTroubleshoots({ limit: 100 }),
            ]);

            // 이번 주 기록만 필터링
            const filterThisWeek = (items) =>
                items.filter(item => new Date(item.createdAt) >= weekStart).length;

            setWeeklyStats({
                algorithms: filterThisWeek(algoRes.items || []),
                csLogs: filterThisWeek(csRes.items || []),
                projects: filterThisWeek(projRes.items || []),
                troubleshoots: filterThisWeek(troubleRes.items || []),
            });
        } catch (err) {
            console.error('주간 통계 로딩 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    // 총 기록 수
    const totalRecords =
        weeklyStats.algorithms +
        weeklyStats.projects +
        weeklyStats.troubleshoots +
        weeklyStats.csLogs;

    return (
        <div className="dashboard">
            {/* 인사말 카드 */}
            <div className="greeting-card">
                <h2>안녕하세요, {user?.name || '개발자'}님! 👋</h2>
                <p>오늘도 성장하는 하루 되세요</p>
            </div>

            {/* 이번 주 활동 */}
            <div className="stats-card">
                <div className="stats-header">
                    <h3>이번 주 활동</h3>
                    <span className="stats-total">총 {totalRecords}건</span>
                </div>

                {loading ? (
                    <div className="loading">로딩 중...</div>
                ) : (
                    <div className="stats-list">
                        <div className="stat-item">
                            <div className="stat-info">
                                <span className="stat-icon">💻</span>
                                <span className="stat-name">알고리즘</span>
                            </div>
                            <div className="stat-value">
                                <span className="stat-count">{weeklyStats.algorithms}문제</span>
                                <div className="stat-bar">
                                    <div
                                        className="stat-bar-fill algo"
                                        style={{ width: `${Math.min(weeklyStats.algorithms * 20, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="stat-item">
                            <div className="stat-info">
                                <span className="stat-icon">🛠️</span>
                                <span className="stat-name">프로젝트</span>
                            </div>
                            <div className="stat-value">
                                <span className="stat-count">{weeklyStats.projects}기능</span>
                                <div className="stat-bar">
                                    <div
                                        className="stat-bar-fill project"
                                        style={{ width: `${Math.min(weeklyStats.projects * 20, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="stat-item">
                            <div className="stat-info">
                                <span className="stat-icon">🔧</span>
                                <span className="stat-name">트러블슈팅</span>
                            </div>
                            <div className="stat-value">
                                <span className="stat-count">{weeklyStats.troubleshoots}건</span>
                                <div className="stat-bar">
                                    <div
                                        className="stat-bar-fill trouble"
                                        style={{ width: `${Math.min(weeklyStats.troubleshoots * 20, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="stat-item">
                            <div className="stat-info">
                                <span className="stat-icon">📚</span>
                                <span className="stat-name">CS 개념</span>
                            </div>
                            <div className="stat-value">
                                <span className="stat-count">{weeklyStats.csLogs}개</span>
                                <div className="stat-bar">
                                    <div
                                        className="stat-bar-fill cs"
                                        style={{ width: `${Math.min(weeklyStats.csLogs * 20, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
