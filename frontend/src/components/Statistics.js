import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Statistics.css';

const Statistics = () => {
    const [stats, setStats] = useState({
        users: 0,
        courses: 0,
        chapters: 0,
        quizzes: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                // Get all subjects first
                const subjectsRes = await axios.get("http://localhost:5001/api/subjects");
                const subjects = subjectsRes.data;

                // Get chapters for all subjects
                let totalChapters = 0;
                let totalQuizzes = 0;

                // Fetch chapters for each subject
                const chaptersPromises = subjects.map(subject =>
                    axios.get(`http://localhost:5001/api/chapters/subject/${subject._id}`)
                );
                const chaptersResponses = await Promise.all(chaptersPromises);
                
                // Count chapters and fetch quizzes for each chapter
                for (const response of chaptersResponses) {
                    const chapters = response.data;
                    totalChapters += chapters.length;

                    // Fetch quizzes for each chapter
                    const quizzesPromises = chapters.map(chapter =>
                        axios.get(`http://localhost:5001/api/quizzes/chapter/${chapter._id}`)
                    );
                    const quizzesResponses = await Promise.all(quizzesPromises);
                    
                    // Count total quizzes
                    quizzesResponses.forEach(quizRes => {
                        totalQuizzes += quizRes.data.length;
                    });
                }

                // Get users count
                const usersRes = await axios.get('http://localhost:5001/api/users');

                setStats({
                    users: usersRes.data.length,
                    courses: subjects.length,
                    chapters: totalChapters,
                    quizzes: totalQuizzes
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching statistics:', error);
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    const statCards = [
        {
            title: 'Total Users',
            value: stats.users,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            )
        },
        {
            title: 'Active Courses',
            value: stats.courses,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
            )
        },
        {
            title: 'Total Chapters',
            value: stats.chapters,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
            )
        },
        {
            title: 'Available Quizzes',
            value: stats.quizzes,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
            )
        }
    ];

    if (loading) {
        return (
            <div className="statistics-container">
                <div className="statistics-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading statistics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="statistics-container">
            <h1 className="statistics-title">Dashboard Overview</h1>
            <div className="statistics-grid">
                {statCards.map((card, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-icon">
                            {card.icon}
                        </div>
                        <div className="stat-info">
                            <h3>{card.title}</h3>
                            <div className="stat-value">{card.value}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Statistics; 