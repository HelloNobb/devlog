/* 트러블슈팅 페이지 - 백엔드 연동 버전 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTroubleshoots, createTroubleshoot, deleteTroubleshoot } from '../api/troubleshoots';
import '../styles/Troubleshoot.css';

const TroubleshootPage = () => {
    const navigate = useNavigate();

    // ==== 상태 정의 ====
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    // ==== 폼 데이터 ====
    const [formData, setFormData] = useState({
        problem: '',
        moment: '',
        solution: '',
        insight: '',
    });

    // ==== 페이징 상태 ====
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // ==== 컴포넌트 로드 시 목록 가져오기 ====
    useEffect(() => {
        fetchLogs();
    }, [page]);

    // ==== 목록 조회 함수 ====
    const fetchLogs = async () => {
        try {
            setLoading(true);
            const response = await getTroubleshoots({ page, limit: 10 });
            setLogs(response.items);
            setTotalPages(response.meta.totalPages);
        } catch (err) {
            setError('기록을 불러오는데 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ==== 폼 입력값 변경 ====
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // ==== 기록 저장 ====
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createTroubleshoot(formData);
            setFormData({ problem: '', moment: '', solution: '', insight: '' });
            setShowForm(false);
            fetchLogs();
        } catch (err) {
            setError('기록 저장에 실패했습니다.');
        }
    };

    // ==== 기록 삭제 ====
    const handleDelete = async (id) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        try {
            await deleteTroubleshoot(id);
            fetchLogs();
        } catch (err) {
            setError('삭제에 실패했습니다.');
        }
    };

    return (
        <div className="trouble-container">
            {/* 헤더 */}
            <header className="trouble-header">
                <button className="back-button" onClick={() => navigate('/')}>
                    ← 대시보드
                </button>
                <h1>🔧 트러블슈팅 기록</h1>
                <button
                    className="add-button"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? '취소' : '+ 새 기록'}
                </button>
            </header>

            {/* 에러 메시지 */}
            {error && <div className="error-message">{error}</div>}

            {/* 새 기록 작성 폼 */}
            {showForm && (
                <form className="trouble-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>🚨 문제 상황 *</label>
                        <textarea
                            name="problem"
                            value={formData.problem}
                            onChange={handleChange}
                            placeholder="어떤 문제가 발생했나요?"
                            rows={3}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>⏰ 트러블 모먼트</label>
                        <input
                            type="text"
                            name="moment"
                            value={formData.moment}
                            onChange={handleChange}
                            placeholder="언제, 어떤 상황에서 발생했나요?"
                        />
                    </div>

                    <div className="form-group">
                        <label>✅ 해결 방법 *</label>
                        <textarea
                            name="solution"
                            value={formData.solution}
                            onChange={handleChange}
                            placeholder="어떻게 해결했나요?"
                            rows={4}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>💡 인사이트</label>
                        <textarea
                            name="insight"
                            value={formData.insight}
                            onChange={handleChange}
                            placeholder="배운 점, 다음에 주의할 점..."
                            rows={3}
                        />
                    </div>

                    <button type="submit" className="submit-button">
                        저장하기
                    </button>
                </form>
            )}

            {/* 기록 목록 */}
            <div className="trouble-list">
                {loading ? (
                    <div className="loading">로딩 중...</div>
                ) : logs.length === 0 ? (
                    <div className="empty-state">
                        <p>아직 기록이 없습니다.</p>
                        <p>트러블슈팅 경험을 기록해보세요! 🔧</p>
                    </div>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="trouble-card">
                            <div className="card-header">
                                <span className="trouble-badge">🚨 트러블슈팅</span>
                                <span className="date">
                                    {new Date(log.createdAt).toLocaleDateString('ko-KR')}
                                </span>
                            </div>

                            <div className="card-section problem">
                                <strong>문제 상황</strong>
                                <p>{log.problem}</p>
                            </div>

                            {log.moment && (
                                <div className="card-section">
                                    <strong>트러블 모먼트</strong>
                                    <p>{log.moment}</p>
                                </div>
                            )}

                            <div className="card-section solution">
                                <strong>해결 방법</strong>
                                <p>{log.solution}</p>
                            </div>

                            {log.insight && (
                                <div className="card-section insight">
                                    <strong>💡 인사이트</strong>
                                    <p>{log.insight}</p>
                                </div>
                            )}

                            <div className="card-actions">
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(log.id)}
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 페이징 */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        이전
                    </button>
                    <span>{page} / {totalPages}</span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
};

export default TroubleshootPage;
