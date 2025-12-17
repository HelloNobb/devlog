/* 트러블슈팅 API 함수들 */
import api from './axios';

// 목록 조회 (페이징)
export const getTroubleshoots = async (params = {}) => {
    const response = await api.get('/troubleshoots', { params });
    return response.data;
};

// 단일 조회
export const getTroubleshoot = async (id) => {
    const response = await api.get(`/troubleshoots/${id}`);
    return response.data;
};

// 생성
export const createTroubleshoot = async (data) => {
    const response = await api.post('/troubleshoots', data);
    return response.data;
};

// 수정
export const updateTroubleshoot = async (id, data) => {
    const response = await api.patch(`/troubleshoots/${id}`, data);
    return response.data;
};

// 삭제
export const deleteTroubleshoot = async (id) => {
    const response = await api.delete(`/troubleshoots/${id}`);
    return response.data;
};
