/* 메모 API 함수 */
import api from './axios';

// 메모 목록 조회 (페이징)
export const getMemos = async ({ page = 1, limit = 10 } = {}) => {
    const response = await api.get('/memos', { params: { page, limit } });
    return response.data;
};

// 메모 생성
export const createMemo = async (data) => {
    const response = await api.post('/memos', data);
    return response.data;
};

// 메모 수정
export const updateMemo = async (id, data) => {
    const response = await api.patch(`/memos/${id}`, data);
    return response.data;
};

// 메모 삭제
export const deleteMemo = async (id) => {
    const response = await api.delete(`/memos/${id}`);
    return response.data;
};

// 댓글 추가
export const addComment = async (data) => {
    const response = await api.post('/memos/comments', data);
    return response.data;
};

// 댓글 삭제
export const deleteComment = async (id) => {
    const response = await api.delete(`/memos/comments/${id}`);
    return response.data;
};
