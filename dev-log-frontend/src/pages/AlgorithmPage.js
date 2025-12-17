/* 알고리즘 페이지 - 이미지 스타일 */
import React, { useState, useEffect } from 'react';
import { getAlgorithms, createAlgorithm, deleteAlgorithm } from '../api/algorithms';
import '../styles/Algorithm.css';

const AlgorithmPage = () => {
    // ==== 상태 정의 ====
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(true);

    // ==== 폼 데이터 ====
    const [formData, setFormData] = useState({
        title: '',
        platform: 'BOJ',
        difficulty: 'Easy',
        tags: '',
        approach: '',
        memo: '',
        problemUrl: '',
    });

    // ==== 통계 데이터 ====
    const [weeklyStats, setWeeklyStats] = useState([0, 0, 0, 0, 0, 0, 0]); // 월~일
    const [tagStats, setTagStats] = useState({});

    // ==== 페이징 ====
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchLogs();
    }, [page]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const response = await getAlgorithms({ page, limit: 100 });
            setLogs(response.items || []);
            setTotalPages(response.meta?.totalPages || 1);

            // 통계 계산
            calculateStats(response.items || []);
        } catch (err) {
            setError('기록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // ==== 통계 계산 ====
    const calculateStats = (items) => {
        // 이번 주 요일별 (월=0, 일=6)
        const now = new Date();
        const dayOfWeek = now.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() + mondayOffset);
        weekStart.setHours(0, 0, 0, 0);

        const weekly = [0, 0, 0, 0, 0, 0, 0];
        const tags = {};

        items.forEach(item => {
            const createdAt = new Date(item.createdAt);

            // 이번주 체크
            if (createdAt >= weekStart) {
                const dayIndex = createdAt.getDay();
                const idx = dayIndex === 0 ? 6 : dayIndex - 1; // 월=0, 일=6
                weekly[idx]++;
            }

            // 태그 집계
            if (item.tags && Array.isArray(item.tags)) {
                item.tags.forEach(tag => {
                    tags[tag] = (tags[tag] || 0) + 1;
                });
            }
        });

        setWeeklyStats(weekly);
        setTagStats(tags);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                ...formData,
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
            };
            await createAlgorithm(submitData);
            setFormData({
                title: '', platform: 'BOJ', difficulty: 'Easy',
                tags: '', approach: '', memo: '', problemUrl: '',
            });
            fetchLogs();
        } catch (err) {
            setError('저장 실패');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('삭제?')) return;
        await deleteAlgorithm(id);
        fetchLogs();
    };

    const getDifficultyColor = (d) => {
        if (d === 'Easy') return '#10b981';
        if (d === 'Medium') return '#f59e0b';
        if (d === 'Hard') return '#ef4444';
        return '#6366f1';
    };

    const dayLabels = ['월', '화', '수', '목', '금', '토', '일'];
    const maxWeekly = Math.max(...weeklyStats, 1);

    // 태그 상위 5개
    const topTags = Object.entries(tagStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    const maxTag = topTags.length > 0 ? topTags[0][1] : 1;

    const tagColors = ['#4f6af5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="algo-page">
            {/* 상단 그리드 */}
            <div className="algo-grid">
                {/* solved.ac 연동 카드 (플레이스홀더) */}
                <div className="algo-card connect-card">
                    <div className="card-title-row">
                        <h3>🔗 solved.ac 연동</h3>
                        <span className="badge inactive">미연동</span>
                    </div>
                    <div className="connect-info">
                        <p>백준 아이디: <strong>연동 필요</strong></p>
                        <p className="stats-row">
                            <span>현재 티어: <strong>-</strong></span>
                            <span>해결한 문제: <strong>-</strong></span>
                            <span>레이팅: <strong>-</strong></span>
                        </p>
                    </div>
                    <button className="sync-button" disabled>
                        🔄 연동 설정하기
                    </button>
                </div>

                {/* 자동 감지된 새 풀이 (플레이스홀더) */}
                <div className="algo-card detect-card">
                    <h3>📋 최근 풀이 목록</h3>
                    <div className="problem-list">
                        {logs.slice(0, 3).map(log => (
                            <div key={log.id} className="problem-item">
                                <span className="problem-icon">✅</span>
                                <div className="problem-info">
                                    <strong>{log.title}</strong>
                                    <span>{log.platform}</span>
                                </div>
                                <span
                                    className="difficulty-badge"
                                    style={{ background: getDifficultyColor(log.difficulty) }}
                                >
                                    {log.difficulty}
                                </span>
                            </div>
                        ))}
                        {logs.length === 0 && <p className="empty">기록 없음</p>}
                    </div>
                </div>
            </div>

            {/* 통계 그리드 */}
            <div className="stats-grid">
                {/* 이번 주 풀이 현황 */}
                <div className="algo-card chart-card">
                    <h3>📊 이번 주 풀이 현황</h3>
                    <div className="bar-chart">
                        {weeklyStats.map((count, i) => (
                            <div key={i} className="bar-item">
                                <span className="bar-label">{dayLabels[i]}</span>
                                <div className="bar-track">
                                    <div
                                        className="bar-fill"
                                        style={{ width: `${(count / maxWeekly) * 100}%` }}
                                    />
                                </div>
                                <span className="bar-count">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 알고리즘 유형별 */}
                <div className="algo-card chart-card">
                    <h3>🏷️ 알고리즘 유형별</h3>
                    <div className="bar-chart">
                        {topTags.length > 0 ? topTags.map(([tag, count], i) => (
                            <div key={tag} className="bar-item">
                                <span className="bar-label">{tag}</span>
                                <div className="bar-track">
                                    <div
                                        className="bar-fill"
                                        style={{
                                            width: `${(count / maxTag) * 100}%`,
                                            background: tagColors[i % tagColors.length]
                                        }}
                                    />
                                </div>
                                <span className="bar-count">{count}</span>
                            </div>
                        )) : (
                            <p className="empty">태그 데이터 없음</p>
                        )}
                    </div>
                </div>
            </div>

            {/* 새 기록 작성 */}
            {showForm && (
                <div className="algo-card form-card">
                    <div className="card-title-row">
                        <h3>✏️ 새 문제 기록</h3>
                        <button className="close-btn" onClick={() => setShowForm(false)}>✕</button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>문제 제목 *</label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="백준 1000번 - A+B"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>플랫폼</label>
                                <select name="platform" value={formData.platform} onChange={handleChange}>
                                    <option value="BOJ">백준</option>
                                    <option value="Programmers">프로그래머스</option>
                                    <option value="LeetCode">LeetCode</option>
                                    <option value="SWEA">SWEA</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>난이도</label>
                                <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                                    <option value="Easy">쉬움</option>
                                    <option value="Medium">보통</option>
                                    <option value="Hard">어려움</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>태그 (쉼표 구분)</label>
                                <input
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    placeholder="DP, 그리디, BFS"
                                />
                            </div>
                            <div className="form-group">
                                <label>문제 링크</label>
                                <input
                                    name="problemUrl"
                                    value={formData.problemUrl}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>풀이 접근법</label>
                            <textarea
                                name="approach"
                                value={formData.approach}
                                onChange={handleChange}
                                placeholder="어떻게 풀었는지..."
                                rows={3}
                            />
                        </div>
                        <button type="submit" className="submit-btn">저장하기</button>
                    </form>
                </div>
            )}

            {!showForm && (
                <button className="add-float-btn" onClick={() => setShowForm(true)}>
                    + 새 기록
                </button>
            )}

            {error && <div className="error-msg">{error}</div>}
        </div>
    );
};

export default AlgorithmPage;
