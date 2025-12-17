/* 프로젝트 개발 페이지 - 백엔드 연동 버전 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, createProject, deleteProject } from '../api/projects';
import '../styles/Project.css';

const ProjectPage = () => {
    const navigate = useNavigate();

    // ==== 상태 정의 ====
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(true); // 페이지 진입 시 폼 바로 표시

    // ==== 폼 데이터 ====
    const [formData, setFormData] = useState({
        projectName: '',
        implementation: '',
        memo: '',
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
            const response = await getProjects({ page, limit: 10 });
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
            await createProject(formData);
            setFormData({ projectName: '', implementation: '', memo: '' });
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
            await deleteProject(id);
            fetchLogs();
        } catch (err) {
            setError('삭제에 실패했습니다.');
        }
    };

    return (
        <div className="project-container">
            {/* 헤더 */}
            <header className="project-header">
                <h1>🛠️ 프로젝트 개발 기록</h1>
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
                <form className="project-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>프로젝트명 *</label>
                        <input
                            type="text"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleChange}
                            placeholder="예: Dev-Log 프로젝트"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>구현한 부분 *</label>
                        <textarea
                            name="implementation"
                            value={formData.implementation}
                            onChange={handleChange}
                            placeholder="오늘 구현한 기능이나 작업 내용..."
                            rows={4}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>메모</label>
                        <textarea
                            name="memo"
                            value={formData.memo}
                            onChange={handleChange}
                            placeholder="느낀 점, 배운 점, 다음 할 일 등..."
                            rows={3}
                        />
                    </div>

                    <button type="submit" className="submit-button">
                        저장하기
                    </button>
                </form>
            )}

            {/* 기록 목록 */}
            <div className="project-list">
                {loading ? (
                    <div className="loading">로딩 중...</div>
                ) : logs.length === 0 ? (
                    <div className="empty-state">
                        <p>아직 기록이 없습니다.</p>
                        <p>프로젝트 개발 기록을 시작해보세요! 🛠️</p>
                    </div>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="project-card">
                            <div className="card-header">
                                <span className="project-name">{log.projectName}</span>
                                <span className="date">
                                    {new Date(log.createdAt).toLocaleDateString('ko-KR')}
                                </span>
                            </div>

                            <div className="card-section">
                                <strong>구현 내용</strong>
                                <p>{log.implementation}</p>
                            </div>

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

export default ProjectPage;
