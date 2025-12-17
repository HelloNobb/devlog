/* solved.ac API - 백엔드 프록시 경유 */
import api from './axios';  // 우리 백엔드 API 클라이언트

/**
 * 사용자 정보 가져오기 (백엔드 프록시 경유)
 * @param {string} handle - 백준 아이디
 */
export const getSolvedUser = async (handle) => {
    // 우리 백엔드의 /solvedac/user 엔드포인트 호출
    // → 백엔드가 solved.ac API 호출 → CORS 문제 없음!
    const response = await api.get('/solvedac/user', {
        params: { handle }
    });
    return response.data;
};

/**
 * 티어 숫자를 한글로 변환
 * @param {number} tier - 티어 숫자 (1~30)
 */
export const getTierName = (tier) => {
    const tiers = [
        'Unrated',
        'Bronze V', 'Bronze IV', 'Bronze III', 'Bronze II', 'Bronze I',
        'Silver V', 'Silver IV', 'Silver III', 'Silver II', 'Silver I',
        'Gold V', 'Gold IV', 'Gold III', 'Gold II', 'Gold I',
        'Platinum V', 'Platinum IV', 'Platinum III', 'Platinum II', 'Platinum I',
        'Diamond V', 'Diamond IV', 'Diamond III', 'Diamond II', 'Diamond I',
        'Ruby V', 'Ruby IV', 'Ruby III', 'Ruby II', 'Ruby I',
        'Master'
    ];
    return tiers[tier] || 'Unknown';
};
