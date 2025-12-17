/* 인증 관련 API 함수들 */
import api from './axios';

// 로그인 API
export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, pwd: password });
    return response.data;
};

// 회원가입 API
export const signup = async (email, password, name) => {
    const response = await api.post('/auth/signup', { email, pwd: password, name });
    return response.data;
};

// 프로필 조회 API
export const getProfile = async () => {
    const response = await api.get('/auth/profile');
    return response.data;
};
