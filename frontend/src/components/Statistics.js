import React from 'react';

const Statistics = ({ isDarkMode }) => {
    return (
        <div>
            <div className="stats-container">
                <div className="stat-card">
                    <h3>26</h3>
                    <p>Total Subjects</p>
                </div>
                <div className="stat-card">
                    <h3>156</h3>
                    <p>Total Chapters</p>
                </div>
                <div className="stat-card">
                    <h3>48</h3>
                    <p>Active Users</p>
                </div>
                <div className="stat-card">
                    <h3>89%</h3>
                    <p>Completion Rate</p>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="content-card">
                    <h2>Recent Activity</h2>
                    <div className="activity-list">
                        <div className="activity-item">
                            <span className="status-tag completed">Completed</span>
                            <p>Medical Terminology Course</p>
                        </div>
                        <div className="activity-item">
                            <span className="status-tag upcoming">Upcoming</span>
                            <p>Anatomy and Physiology</p>
                        </div>
                    </div>
                </div>

                <div className="content-card">
                    <h2>Performance Overview</h2>
                    <div className="performance-stats">
                        <div className="stat-item">
                            <p>Average Score</p>
                            <h3>92%</h3>
                        </div>
                        <div className="stat-item">
                            <p>Completed Courses</p>
                            <h3>12</h3>
                        </div>
                    </div>
                </div>

                <div className="content-card">
                    <h2>Quick Actions</h2>
                    <div className="action-buttons">
                        <button className="action-button">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v14M5 12h14"/>
                            </svg>
                            Add New Subject
                        </button>
                        <button className="action-button">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Export Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics; 