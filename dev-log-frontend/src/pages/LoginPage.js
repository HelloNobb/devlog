import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const LoginPage = () => {
    const navigate = useNavigate(); // 페이지 이동 함수
    const { login } = useAuth();    // : context에서 로그인 함수 가져오기
    // ==== 폼 입력값 상태 ====
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(''); // 에러 메세지
    const [loading, setLoading] = useState(false); // 로딩 상태

    // ==== 입력값 변경 핸들러 ====
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value, // 변경된 필드만 업데이트
        });
    };

    // ==== 폼 제출 핸들러 ====
    const handleSubmit = async (e) => {
        e.preventDefault(); // 새로고침 방지
        setError('');
        setLoading(true);

        try {
            // 1: 백엔드에 로그인 요청
            const response = await loginApi(formData.email, formData.password);
            // 2: 성공하면 context에 토큰 저장 (백엔드는 accessToken으로 반환)
            login(response.accessToken, response.user);
            // 3: 대시보드로 이동
            navigate('/');
        } catch (err) {
            // 실패하면 에러 메세지 표시
            setError(err.response?.data?.message || '로그인에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Dev-Log</h1>
                    <p className="auth-subtitle">개발자 학습 기록장</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <h2>로그인</h2>

                    {error && <div className="auth-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">이메일</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="이메일을 입력하세요"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="비밀번호를 입력하세요"
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? '로그인 중...' : '로그인'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>계정이 없으신가요? <Link to="/signup">회원가입</Link></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
