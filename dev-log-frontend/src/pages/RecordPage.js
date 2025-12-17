/* 기록 작성 페이지 - 카테고리 선택 후 기록 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecordPage.css';

const RecordPage = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);

    const categories = [
        { id: 'algorithms', name: '알고리즘', icon: '💻', path: '/algorithms' },
        { id: 'projects', name: '프로젝트', icon: '🛠️', path: '/projects' },
        { id: 'troubleshoots', name: '트러블슈팅', icon: '🔧', path: '/troubleshoots' },
        { id: 'cs-logs', name: 'CS 개념', icon: '📚', path: '/cs-logs' },
    ];

    const handleCategoryClick = (category) => {
        setSelectedCategory(category.id);
        navigate(category.path);
    };

    return (
        <div className="record-page">
            <h2 className="page-title">오늘의 기록 작성</h2>
            <p className="page-subtitle">카테고리를 선택해주세요</p>

            <div className="category-grid">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className={`category-card ${selectedCategory === cat.id ? 'selected' : ''}`}
                        onClick={() => handleCategoryClick(cat)}
                    >
                        <span className="category-icon">{cat.icon}</span>
                        <span className="category-name">{cat.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default RecordPage;
