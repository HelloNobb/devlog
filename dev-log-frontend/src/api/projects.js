/* 프로젝트 API 함수들 */
import api from './axios';

// 목록 조회 (페이징)
export const getProjects = async (params = {}) => {
    const response = await api.get('/projects', { params });
    return response.data;
};

// 단일 조회
export const getProject = async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
};

// 생성
export const createProject = async (data) => {
    const response = await api.post('/projects', data);
    return response.data;
};

// 수정
export const updateProject = async (id, data) => {
    const response = await api.patch(`/projects/${id}`, data);
    return response.data;
};

// 삭제
export const deleteProject = async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
};
