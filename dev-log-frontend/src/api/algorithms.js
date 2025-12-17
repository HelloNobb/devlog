import api from './axios';

// 알고리즘 기록 목록 조회
export const getAlgorithms = async (params = {}) => {
    const response = await api.get('/algorithms', { params });
    return response.data;
};

// 알고리즘 기록 상세 조회
export const getAlgorithm = async (id) => {
    const response = await api.get(`/algorithms/${id}`);
    return response.data;
};

// 알고리즘 기록 생성
export const createAlgorithm = async (data) => {
    const response = await api.post('/algorithms', data);
    return response.data;
};

// 알고리즘 기록 수정
export const updateAlgorithm = async (id, data) => {
    const response = await api.patch(`/algorithms/${id}`, data);
    return response.data;
};

// 알고리즘 기록 삭제
export const deleteAlgorithm = async (id) => {
    const response = await api.delete(`/algorithms/${id}`);
    return response.data;
};
