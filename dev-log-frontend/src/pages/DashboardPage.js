/* 대시보드 페이지 - 주간 활동 + 스티커 메모 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAlgorithms } from '../api/algorithms';
import { getCsLogs } from '../api/csLogs';
import { getProjects } from '../api/projects';
import { getTroubleshoots } from '../api/troubleshoots';
import { getMemos, createMemo, updateMemo, deleteMemo, addComment, deleteComment } from '../api/memos';
import '../styles/Dashboard.css';

const DashboardPage = () => {
    const { user } = useAuth();
    const [weeklyStats, setWeeklyStats] = useState({
        algorithms: 0, projects: 0, troubleshoots: 0, csLogs: 0,
    });
    const [loading, setLoading] = useState(true);

    // 메모 상태
    const [memos, setMemos] = useState([]);
    const [memoPage, setMemoPage] = useState(1);
    const [memoMeta, setMemoMeta] = useState({ totalPages: 1 });
    const [newMemo, setNewMemo] = useState('');
    const [editingMemo, setEditingMemo] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [newComment, setNewComment] = useState({});

    useEffect(() => {
        fetchWeeklyStats();
    }, []);

    useEffect(() => {
        fetchMemos();
    }, [memoPage]);

    const fetchWeeklyStats = async () => {
        try {
            setLoading(true);
            const now = new Date();
            const dayOfWeek = now.getDay();
            const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() + mondayOffset);
            weekStart.setHours(0, 0, 0, 0);

            const [algoRes, csRes, projRes, troubleRes] = await Promise.all([
                getAlgorithms({ limit: 100 }),
                getCsLogs({ limit: 100 }),
                getProjects({ limit: 100 }),
                getTroubleshoots({ limit: 100 }),
            ]);

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

    const fetchMemos = async () => {
        try {
            const res = await getMemos({ page: memoPage, limit: 5 });
            setMemos(res.items || []);
            setMemoMeta(res.meta || { totalPages: 1 });
        } catch (err) {
            console.error('메모 로딩 실패:', err);
        }
    };

    // 메모 생성
    const handleCreateMemo = async () => {
        if (!newMemo.trim()) return;
        await createMemo({ content: newMemo });
        setNewMemo('');
        fetchMemos();
    };

    // 메모 수정 시작
    const startEdit = (memo) => {
        setEditingMemo(memo.id);
        setEditContent(memo.content);
    };

    // 메모 수정 저장
    const handleUpdateMemo = async (id) => {
        await updateMemo(id, { content: editContent });
        setEditingMemo(null);
        fetchMemos();
    };

    // 메모 삭제
    const handleDeleteMemo = async (id) => {
        if (!window.confirm('삭제하시겠습니까?')) return;
        await deleteMemo(id);
        fetchMemos();
    };

    // 댓글 추가
    const handleAddComment = async (memoId) => {
        if (!newComment[memoId]?.trim()) return;
        await addComment({ memoId, content: newComment[memoId] });
        setNewComment({ ...newComment, [memoId]: '' });
        fetchMemos();
    };

    // 댓글 삭제
    const handleDeleteComment = async (commentId) => {
        await deleteComment(commentId);
        fetchMemos();
    };

    const totalRecords = weeklyStats.algorithms + weeklyStats.projects +
        weeklyStats.troubleshoots + weeklyStats.csLogs;

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

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
                                    <div className="stat-bar-fill algo" style={{ width: `${Math.min(weeklyStats.algorithms * 20, 100)}%` }} />
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
                                    <div className="stat-bar-fill project" style={{ width: `${Math.min(weeklyStats.projects * 20, 100)}%` }} />
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
                                    <div className="stat-bar-fill trouble" style={{ width: `${Math.min(weeklyStats.troubleshoots * 20, 100)}%` }} />
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
                                    <div className="stat-bar-fill cs" style={{ width: `${Math.min(weeklyStats.csLogs * 20, 100)}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 스티커 메모 섹션 */}
            <div className="memo-section">
                <h3>📝 스티커 메모</h3>

                {/* 새 메모 작성 */}
                <div className="memo-form">
                    <textarea
                        value={newMemo}
                        onChange={(e) => setNewMemo(e.target.value)}
                        placeholder="자유롭게 메모를 남겨보세요..."
                        rows={3}
                    />
                    <button onClick={handleCreateMemo}>메모 추가</button>
                </div>

                {/* 메모 목록 */}
                <div className="memo-list">
                    {memos.map(memo => (
                        <div key={memo.id} className="memo-card">
                            <div className="memo-header">
                                <span className="memo-author">{memo.user?.name || '익명'}</span>
                                <span className="memo-date">{formatDate(memo.createdAt)}</span>
                            </div>

                            {editingMemo === memo.id ? (
                                <div className="memo-edit">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        rows={3}
                                    />
                                    <div className="memo-edit-buttons">
                                        <button onClick={() => handleUpdateMemo(memo.id)}>저장</button>
                                        <button onClick={() => setEditingMemo(null)}>취소</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="memo-content">{memo.content}</div>
                                    {memo.userId === user?.id && (
                                        <div className="memo-actions">
                                            <button onClick={() => startEdit(memo)}>수정</button>
                                            <button onClick={() => handleDeleteMemo(memo.id)}>삭제</button>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* 댓글 섹션 */}
                            <div className="memo-comments">
                                {memo.comments?.map(comment => (
                                    <div key={comment.id} className="comment">
                                        <span className="comment-author">{comment.user?.name}</span>
                                        <span className="comment-content">{comment.content}</span>
                                        {comment.userId === user?.id && (
                                            <button
                                                className="comment-delete"
                                                onClick={() => handleDeleteComment(comment.id)}
                                            >×</button>
                                        )}
                                    </div>
                                ))}
                                <div className="comment-form">
                                    <input
                                        value={newComment[memo.id] || ''}
                                        onChange={(e) => setNewComment({ ...newComment, [memo.id]: e.target.value })}
                                        placeholder="댓글..."
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment(memo.id)}
                                    />
                                    <button onClick={() => handleAddComment(memo.id)}>↵</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 페이징 */}
                {memoMeta.totalPages > 1 && (
                    <div className="memo-pagination">
                        <button
                            disabled={memoPage <= 1}
                            onClick={() => setMemoPage(p => p - 1)}
                        >이전</button>
                        <span>{memoPage} / {memoMeta.totalPages}</span>
                        <button
                            disabled={memoPage >= memoMeta.totalPages}
                            onClick={() => setMemoPage(p => p + 1)}
                        >다음</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
