/* CS 학습 페이지 - 학습 기록 목록 조회 + 새 기록 작성 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCsLogs, createCsLog, deleteCsLog } from '../api/csLogs';
import '../styles/CsLog.css';

const CsLogPage = () => {
    const navigate = useNavigate();

    // ==== 상태(State) 정의 ====
    const [logs, setLogs] = useState([]);           // 기록 목록
    const [loading, setLoading] = useState(true);   // 로딩 상태
    const [error, setError] = useState('');          // 에러 메시지
    const [showForm, setShowForm] = useState(true); // 페이지 진입 시 폼 바로 표시

    // ==== 새 기록 작성용 폼 데이터 ====
    const [formData, setFormData] = useState({
        category: '',   // 카테고리: 네트워크, OS 등
        topic: '',      // 주제: HTTP Handshake 등
        content: '',    // 학습 내용
    });

    // ==== 페이징 상태 ====
    const [page, setPage] = useState(1);            // 현재 페이지
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수

    // ==== useEffect: 컴포넌트 로드 시 목록 가져오기 ====
    useEffect(() => {
        fetchLogs();    // 페이지 처음 열릴 때 목록 가져오기
    }, [page]); // page가 바뀔 때마다 다시 호출

    // ==== 목록 조회 함수 ====
    const fetchLogs = async () => {
        try {
            setLoading(true);
            // 백엔드 API 호출 (page, limit 파라미터 전달)
            const response = await getCsLogs({ page, limit: 10 });
            setLogs(response.items);                    // 기록 목록
            setTotalPages(response.meta.totalPages);    // 전체 페이지 수
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
        e.preventDefault(); // 페이지 새로고침 방지

        try {
            // 백엔드에 POST 요청
            await createCsLog(formData);

            // 성공 시: 폼 초기화 + 목록 새로고침 + 폼 닫기
            setFormData({ category: '', topic: '', content: '' });
            setShowForm(false);
            fetchLogs(); // 목록 다시 불러오기
        } catch (err) {
            setError('기록 저장에 실패했습니다.');
            console.error(err);
        }
    };

    // ==== 기록 삭제 함수 ====
    const handleDelete = async (id) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        try {
            await deleteCsLog(id);
            fetchLogs(); // 삭제 후 목록 새로고침
        } catch (err) {
            setError('삭제에 실패했습니다.');
        }
    };

    // ==== 화면 렌더링 ====
    return (
        <div className="cslog-container">
            {/* 헤더 */}
            <header className="cslog-header">
                <h1>📚 CS 학습 기록</h1>
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
                <form className="cslog-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>카테고리</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">선택하세요</option>
                                <option value="네트워크">네트워크</option>
                                <option value="운영체제">운영체제</option>
                                <option value="자료구조">자료구조</option>
                                <option value="알고리즘">알고리즘</option>
                                <option value="데이터베이스">데이터베이스</option>
                                <option value="컴퓨터구조">컴퓨터구조</option>
                                <option value="기타">기타</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>학습 주제</label>
                            <input
                                type="text"
                                name="topic"
                                value={formData.topic}
                                onChange={handleChange}
                                placeholder="예: TCP 3-way handshake"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>학습 내용</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="학습한 내용을 자유롭게 작성하세요..."
                            rows={6}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        저장하기
                    </button>
                </form>
            )}

            {/* 기록 목록 */}
            <div className="cslog-list">
                {loading ? (
                    <div className="loading">로딩 중...</div>
                ) : logs.length === 0 ? (
                    <div className="empty-state">
                        <p>아직 기록이 없습니다.</p>
                        <p>첫 번째 CS 학습 기록을 작성해보세요! 📝</p>
                    </div>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="cslog-card">
                            <div className="card-header">
                                <span className="category-badge">{log.category}</span>
                                <span className="date">
                                    {new Date(log.createdAt).toLocaleDateString('ko-KR')}
                                </span>
                            </div>
                            <h3 className="card-topic">{log.topic}</h3>
                            <p className="card-content">{log.content}</p>
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

export default CsLogPage;
