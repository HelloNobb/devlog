/* API 통신 기본 설정 */
import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
    baseURL: 'http://localhost:3000', // NestJS 백엔드 주소
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터 - JWT 토큰 자동 첨부
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터(모든 API 응답이 오면 자동으로 실행) - 401 에러 시 로그인 페이지로 리다이렉트
api.interceptors.response.use(
    (response) => response,
    (error) => { // 401 에러 = 인증 실패 (토큰 만료 등)
        if (error.response?.status === 401) {
            localStorage.removeItem('token'); // 토큰 삭제
            window.location.href = '/login'; // 로그인 페이지로 강제이동
        }
        return Promise.reject(error); // 에러 전달
    }
);

export default api;
