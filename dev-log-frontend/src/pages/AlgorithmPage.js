/* 알고리즘 페이지 - 알고리즘 문제 풀이 기록 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAlgorithms, createAlgorithm, deleteAlgorithm } from '../api/algorithms';
import '../styles/Algorithm.css';

const AlgorithmPage = () => {
    const navigate = useNavigate();

    // ==== 상태(State) 정의 ====
    const [logs, setLogs] = useState([]);           // 기록 목록
    const [loading, setLoading] = useState(true);   // 로딩 상태
    const [error, setError] = useState('');          // 에러 메시지
    const [showForm, setShowForm] = useState(false); // 작성 폼 표시 여부

    // ==== 새 기록 작성용 폼 데이터 ====
    const [formData, setFormData] = useState({
        title: '',          // 문제 제목
        platform: '',       // 플랫폼 (BOJ, 프로그래머스 등)
        difficulty: '쉬움', // 난이도
        tags: '',           // 태그 (쉼표로 구분)
        approach: '',       // 풀이 접근법
        memo: '',           // 메모
        problemUrl: '',     // 문제 링크
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
            const response = await getAlgorithms({ page, limit: 10 });
            setLogs(response.items);
            setTotalPages(response.meta.totalPages);
        } catch (err) {
            setError('기록을 불러오는데 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ==== 폼 입력값 변경 핸들러 ====
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // ==== 새 기록 저장 함수 ====
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // tags를 배열로 변환 (쉼표 구분)
            const submitData = {
                ...formData,
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
            };

            await createAlgorithm(submitData);

            // 폼 초기화 + 목록 새로고침 + 폼 닫기
            setFormData({
                title: '', platform: '', difficulty: 'Easy',
                tags: '', approach: '', memo: '', problemUrl: '',
            });
            setShowForm(false);
            fetchLogs();
        } catch (err) {
            setError('기록 저장에 실패했습니다.');
            console.error(err);
        }
    };

    // ==== 기록 삭제 함수 ====
    const handleDelete = async (id) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        try {
            await deleteAlgorithm(id);
            fetchLogs();
        } catch (err) {
            setError('삭제에 실패했습니다.');
        }
    };

    // ==== 난이도 뱃지 색상 ====
    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case '쉬움': return '#10b981';
            case '보통': return '#f59e0b';
            case '어려움': return '#ef4444';
            default: return '#6366f1';
        }
    };

    // ==== 화면 렌더링 ====
    return (
        <div className="algo-container">
            {/* 헤더 */}
            <header className="algo-header">
                <button className="back-button" onClick={() => navigate('/')}>
                    ← 대시보드
                </button>
                <h1>💻 알고리즘 기록</h1>
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
                <form className="algo-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>문제 제목 *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="예: 백준 1000번 - A+B"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>플랫폼</label>
                            <select
                                name="platform"
                                value={formData.platform}
                                onChange={handleChange}
                            >
                                <option value="">선택하세요</option>
                                <option value="BOJ">백준 (BOJ)</option>
                                <option value="Programmers">프로그래머스</option>
                                <option value="LeetCode">LeetCode</option>
                                <option value="SWEA">SWEA</option>
                                <option value="기타">기타</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>난이도 *</label>
                            <select
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleChange}
                                required
                            >
                                <option value="Easy">쉬움 (Easy)</option>
                                <option value="Medium">보통 (Medium)</option>
                                <option value="Hard">어려움 (Hard)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>태그 (쉼표로 구분)</label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="예: DP, 그리디, BFS"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>문제 링크</label>
                        <input
                            type="url"
                            name="problemUrl"
                            value={formData.problemUrl}
                            onChange={handleChange}
                            placeholder="https://www.acmicpc.net/problem/1000"
                        />
                    </div>

                    <div className="form-group">
                        <label>풀이 접근법</label>
                        <textarea
                            name="approach"
                            value={formData.approach}
                            onChange={handleChange}
                            placeholder="어떤 방식으로 문제를 접근했는지..."
                            rows={4}
                        />
                    </div>

                    <div className="form-group">
                        <label>메모</label>
                        <textarea
                            name="memo"
                            value={formData.memo}
                            onChange={handleChange}
                            placeholder="기억해둘 점, 실수한 부분 등..."
                            rows={3}
                        />
                    </div>

                    <button type="submit" className="submit-button">
                        저장하기
                    </button>
                </form>
            )}

            {/* 기록 목록 */}
            <div className="algo-list">
                {loading ? (
                    <div className="loading">로딩 중...</div>
                ) : logs.length === 0 ? (
                    <div className="empty-state">
                        <p>아직 기록이 없습니다.</p>
                        <p>첫 번째 알고리즘 문제를 기록해보세요! 💻</p>
                    </div>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="algo-card">
                            <div className="card-header">
                                <div className="card-badges">
                                    {log.platform && (
                                        <span className="platform-badge">{log.platform}</span>
                                    )}
                                    <span
                                        className="difficulty-badge"
                                        style={{ background: getDifficultyColor(log.difficulty) }}
                                    >
                                        {log.difficulty}
                                    </span>
                                </div>
                                <span className="date">
                                    {new Date(log.createdAt).toLocaleDateString('ko-KR')}
                                </span>
                            </div>

                            <h3 className="card-title">
                                {log.problemUrl ? (
                                    <a href={log.problemUrl} target="_blank" rel="noopener noreferrer">
                                        {log.title} 🔗
                                    </a>
                                ) : (
                                    log.title
                                )}
                            </h3>

                            {log.tags && log.tags.length > 0 && (
                                <div className="card-tags">
                                    {log.tags.map((tag, index) => (
                                        <span key={index} className="tag">{tag}</span>
                                    ))}
                                </div>
                            )}

                            {log.approach && (
                                <div className="card-section">
                                    <strong>접근법</strong>
                                    <p>{log.approach}</p>
                                </div>
                            )}

                            {log.memo && (
                                <div className="card-section">
                                    <strong>메모</strong>
                                    <p>{log.memo}</p>
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

export default AlgorithmPage;
