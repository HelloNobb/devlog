/* 알고리즘 페이지 - solved.ac 연동 포함 */
import React, { useState, useEffect } from 'react';
import { getAlgorithms, createAlgorithm, deleteAlgorithm } from '../api/algorithms';
import { getSolvedUser, getTierName } from '../api/solvedac';
import '../styles/Algorithm.css';

const AlgorithmPage = () => {
    // ==== 상태 정의 ====
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(true);

    // ==== solved.ac 연동 상태 ====
    const [showConnectModal, setShowConnectModal] = useState(false);  // 모달 표시
    const [bojHandle, setBojHandle] = useState('');                    // 입력 중인 백준 ID
    const [solvedUser, setSolvedUser] = useState(null);                // 연동된 사용자 정보
    const [connectLoading, setConnectLoading] = useState(false);       // 연동 중 로딩

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
    const [weeklyStats, setWeeklyStats] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [tagStats, setTagStats] = useState({});

    // ==== 페이지 로드 시 ====
    useEffect(() => {
        fetchLogs();
        // 저장된 백준 ID가 있으면 불러오기
        const savedHandle = localStorage.getItem('bojHandle');
        if (savedHandle) {
            loadSolvedUser(savedHandle);
        }
    }, []);

    // ==== solved.ac 사용자 정보 로드 ====
    const loadSolvedUser = async (handle) => {
        try {
            const user = await getSolvedUser(handle);
            setSolvedUser(user);
            localStorage.setItem('bojHandle', handle);
        } catch (err) {
            console.error('solved.ac 로드 실패:', err);
        }
    };

    // ==== 연동 버튼 클릭 ====
    const handleConnect = async () => {
        if (!bojHandle.trim()) {
            setError('백준 아이디를 입력해주세요.');
            return;
        }

        setConnectLoading(true);
        try {
            const user = await getSolvedUser(bojHandle.trim());
            setSolvedUser(user);
            localStorage.setItem('bojHandle', bojHandle.trim());
            setShowConnectModal(false);
            setBojHandle('');
        } catch (err) {
            setError(err.message);
        } finally {
            setConnectLoading(false);
        }
    };

    // ==== 연동 해제 ====
    const handleDisconnect = () => {
        setSolvedUser(null);
        localStorage.removeItem('bojHandle');
    };

    // ==== 기록 목록 조회 ====
    const fetchLogs = async () => {
        try {
            setLoading(true);
            const response = await getAlgorithms({ page: 1, limit: 100 });
            setLogs(response.items || []);
            calculateStats(response.items || []);
        } catch (err) {
            setError('기록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // ==== 통계 계산 ====
    const calculateStats = (items) => {
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
            if (createdAt >= weekStart) {
                const dayIndex = createdAt.getDay();
                const idx = dayIndex === 0 ? 6 : dayIndex - 1;
                weekly[idx]++;
            }
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
    const topTags = Object.entries(tagStats).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxTag = topTags.length > 0 ? topTags[0][1] : 1;
    const tagColors = ['#4f6af5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="algo-page">
            {/* 모달 (연동 설정) */}
            {showConnectModal && (
                <div className="modal-overlay" onClick={() => setShowConnectModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>🔗 solved.ac 연동</h3>
                        <p>백준 아이디를 입력하세요</p>
                        <input
                            type="text"
                            value={bojHandle}
                            onChange={(e) => setBojHandle(e.target.value)}
                            placeholder="예: hyeonji_jungle"
                            className="modal-input"
                        />
                        <div className="modal-buttons">
                            <button
                                className="modal-btn cancel"
                                onClick={() => setShowConnectModal(false)}
                            >
                                취소
                            </button>
                            <button
                                className="modal-btn confirm"
                                onClick={handleConnect}
                                disabled={connectLoading}
                            >
                                {connectLoading ? '연동 중...' : '연동하기'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 상단 그리드 */}
            <div className="algo-grid">
                {/* solved.ac 연동 카드 */}
                <div className="algo-card connect-card">
                    <div className="card-title-row">
                        <h3>🔗 solved.ac 연동</h3>
                        <span className={`badge ${solvedUser ? 'active' : 'inactive'}`}>
                            {solvedUser ? '✓ 연동됨' : '미연동'}
                        </span>
                    </div>

                    {solvedUser ? (
                        <>
                            <div className="connect-info">
                                <p>백준 아이디: <strong>{solvedUser.handle}</strong></p>
                                <p className="stats-row">
                                    <span>현재 티어: <strong>{getTierName(solvedUser.tier)}</strong></span>
                                    <span>해결한 문제: <strong>{solvedUser.solvedCount}개</strong></span>
                                    <span>레이팅: <strong>{solvedUser.rating}</strong></span>
                                </p>
                            </div>
                            <button className="sync-button disconnect" onClick={handleDisconnect}>
                                연동 해제
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="connect-info">
                                <p>백준 아이디를 연동하면 티어, 레이팅, 푼 문제 수를 확인할 수 있어요!</p>
                            </div>
                            <button className="sync-button" onClick={() => setShowConnectModal(true)}>
                                🔄 연동 설정하기
                            </button>
                        </>
                    )}
                </div>

                {/* 최근 풀이 목록 */}
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
                <div className="algo-card chart-card">
                    <h3>📊 이번 주 풀이 현황</h3>
                    <div className="bar-chart">
                        {weeklyStats.map((count, i) => (
                            <div key={i} className="bar-item">
                                <span className="bar-label">{dayLabels[i]}</span>
                                <div className="bar-track">
                                    <div className="bar-fill" style={{ width: `${(count / maxWeekly) * 100}%` }} />
                                </div>
                                <span className="bar-count">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="algo-card chart-card">
                    <h3>🏷️ 알고리즘 유형별</h3>
                    <div className="bar-chart">
                        {topTags.length > 0 ? topTags.map(([tag, count], i) => (
                            <div key={tag} className="bar-item">
                                <span className="bar-label">{tag}</span>
                                <div className="bar-track">
                                    <div className="bar-fill" style={{ width: `${(count / maxTag) * 100}%`, background: tagColors[i % tagColors.length] }} />
                                </div>
                                <span className="bar-count">{count}</span>
                            </div>
                        )) : <p className="empty">태그 데이터 없음</p>}
                    </div>
                </div>
            </div>

            {/* 새 기록 폼 */}
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
                                <input name="title" value={formData.title} onChange={handleChange} placeholder="백준 1000번 - A+B" required />
                            </div>
                            <div className="form-group">
                                <label>플랫폼</label>
                                <select name="platform" value={formData.platform} onChange={handleChange}>
                                    <option value="BOJ">백준</option>
                                    <option value="Programmers">프로그래머스</option>
                                    <option value="LeetCode">LeetCode</option>
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
                                <input name="tags" value={formData.tags} onChange={handleChange} placeholder="DP, 그리디" />
                            </div>
                            <div className="form-group">
                                <label>문제 링크</label>
                                <input name="problemUrl" value={formData.problemUrl} onChange={handleChange} placeholder="https://..." />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>풀이 접근법</label>
                            <textarea name="approach" value={formData.approach} onChange={handleChange} placeholder="어떻게 풀었는지..." rows={3} />
                        </div>
                        <button type="submit" className="submit-btn">저장하기</button>
                    </form>
                </div>
            )}

            {!showForm && (
                <button className="add-float-btn" onClick={() => setShowForm(true)}>+ 새 기록</button>
            )}

            {error && <div className="error-msg">{error}</div>}
        </div>
    );
};

export default AlgorithmPage;
