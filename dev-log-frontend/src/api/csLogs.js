import api from './axios';

// CS 학습 기록 목록 조회
export const getCsLogs = async (params = {}) => {
    const response = await api.get('/cs-logs', { params });
    return response.data;
};

// CS 학습 기록 상세 조회
export const getCsLog = async (id) => {
    const response = await api.get(`/cs-logs/${id}`);
    return response.data;
};

// CS 학습 기록 생성
export const createCsLog = async (data) => {
    const response = await api.post('/cs-logs', data);
    return response.data;
};

// CS 학습 기록 수정
export const updateCsLog = async (id, data) => {
    const response = await api.patch(`/cs-logs/${id}`, data);
    return response.data;
};

// CS 학습 기록 삭제
export const deleteCsLog = async (id) => {
    const response = await api.delete(`/cs-logs/${id}`);
    return response.data;
};
