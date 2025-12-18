/* 기능: 로그인 상태 관리 - 앱 전체에서 지금 로그인 됐는지 알게 해주는 창고 */
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null); //context 생성 - 전역 상태 저장소

export const AuthProvider = ({ children }) => {
    // ==== 상태(state) 정의 ====   **useState()의 반환값: [현재값, 값을 바꾸는 함수]
    const [user, setUser] = useState(null); // 사용자 정보
    const [token, setToken] = useState(localStorage.getItem('token'));  // jwt 토큰
    const [loading, setLoading] = useState(true); // 로딩 상태

    // ==== useEffect: 컴포넌트가 처음 렌더링될 때 실행 ====
    useEffect(() => {
        // 토큰이 있으면 로그인 상태로 설정
        if (token) {
            setLoading(false); //토큰 있으면 로딩 끝
        } else {
            setLoading(false); //없어도 로딩 끝
        }
    }, [token]); // 토큰이 바뀔 때마다 다시 실행

    const login = (accessToken, userData) => {
        localStorage.setItem('token', accessToken); //브라우저에 토큰 저장
        setToken(accessToken);  // 상태 업데이트
        setUser(userData); // 사용자 정보 저장
    };

    const logout = () => {
        localStorage.removeItem('token'); //브라우저 토큰 삭제
        localStorage.removeItem('bojHandle'); //백준 핸들 삭제
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!token; //로그인 여부 판단 (토큰 있으면 true)

    return ( //==== value로 전달할 것들 ====
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            isAuthenticated,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};
/* context 쉽게 사용하게 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
// 다른 컴포넌트에서 이렇게 사용:
// const { isAuthenticated, login, logout } = useAuth();