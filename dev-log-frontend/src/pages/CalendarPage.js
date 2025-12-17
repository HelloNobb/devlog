/* 캘린더 페이지 - 기록 날짜별 조회 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Calendar.css';

const CalendarPage = () => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());

    // ==== 현재 월의 날짜 정보 계산 ====
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 이번 달 첫째 날과 마지막 날
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // 첫째 날의 요일 (0: 일요일)
    const startDayOfWeek = firstDay.getDay();
    // 이번 달 총 일수
    const daysInMonth = lastDay.getDate();

    // ==== 이전/다음 달 이동 ====
    const goToPrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // ==== 달력 날짜 배열 생성 ====
    const renderCalendarDays = () => {
        const days = [];
        const today = new Date();

        // 빈 칸 (이전 달)
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // 이번 달 날짜들
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday =
                today.getFullYear() === year &&
                today.getMonth() === month &&
                today.getDate() === day;

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isToday ? 'today' : ''}`}
                >
                    <span className="day-number">{day}</span>
                    {/* TODO: 해당 날짜의 기록 표시 (백엔드 연동 후) */}
                </div>
            );
        }

        return days;
    };

    // ==== 월 이름 ====
    const monthNames = [
        '1월', '2월', '3월', '4월', '5월', '6월',
        '7월', '8월', '9월', '10월', '11월', '12월'
    ];

    return (
        <div className="calendar-container">
            {/* 헤더 */}
            <header className="calendar-header">
                <h1>📅 학습 캘린더</h1>
            </header>

            {/* 월 네비게이션 */}
            <div className="month-navigation">
                <button onClick={goToPrevMonth}>◀ 이전</button>
                <h2>{year}년 {monthNames[month]}</h2>
                <button onClick={goToNextMonth}>다음 ▶</button>
            </div>

            <button className="today-button" onClick={goToToday}>
                오늘로 이동
            </button>

            {/* 요일 헤더 */}
            <div className="weekday-header">
                {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                    <div
                        key={day}
                        className={`weekday ${index === 0 ? 'sunday' : ''} ${index === 6 ? 'saturday' : ''}`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* 달력 그리드 */}
            <div className="calendar-grid">
                {renderCalendarDays()}
            </div>

            {/* 안내 메시지 */}
            <div className="info-banner">
                ⚠️ 날짜별 기록 표시는 백엔드 연동 후 구현 예정
            </div>
        </div>
    );
};

export default CalendarPage;
