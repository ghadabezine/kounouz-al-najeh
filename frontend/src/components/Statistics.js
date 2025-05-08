import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const Statistics = ({ isDarkMode, setActivePage }) => {
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalChapters: 0,
    activeUsers: 0,
    completionRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      const [subjectsRes, usersRes] = await Promise.all([
        axios.get("http://localhost:5005/api/subjects"),
        axios.get("http://localhost:5005/api/users"),
      ]);

      const subjects = subjectsRes.data;
      const users = usersRes.data;
      let totalChapters = 0;

      // Calculate total chapters
      subjects.forEach((subject) => {
        totalChapters += subject.chapters?.length || 0;
      });

      setStats({
        totalSubjects: subjects.length,
        totalChapters: totalChapters,
        activeUsers: users.filter((user) => user.isActive).length,
        completionRate: calculateCompletionRate(subjects),
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCompletionRate = (subjects) => {
    // This is a placeholder calculation - adjust based on your actual completion criteria
    const totalSubjects = subjects.length;
    const completedSubjects = subjects.filter((subject) =>
      subject.chapters?.every((chapter) => chapter.completed)
    ).length;

    return totalSubjects > 0
      ? Math.round((completedSubjects / totalSubjects) * 100)
      : 0;
  };

  const exportToPDF = async () => {
    // Ensure we have the latest data before generating the PDF
    await fetchStatistics();

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text("Kounouz Al Najeh - Statistics Report", 20, 20);

    // Add statistics table
    doc.setFontSize(12);
    const tableData = [
      ["Metric", "Value"],
      ["Total Subjects", stats.totalSubjects],
      ["Total Chapters", stats.totalChapters],
      ["Active Users", stats.activeUsers],
      ["Completion Rate", `${stats.completionRate}%`],
    ];

    autoTable(doc, {
      startY: 30,
      head: [tableData[0]],
      body: tableData.slice(1),
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [73, 174, 239] },
    });

    // Add timestamp
    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      20,
      doc.internal.pageSize.height - 20
    );

    // Save the PDF
    doc.save("kounouz-al-najeh-statistics.pdf");
  };

  const handleAddSubject = () => {
    setActivePage("subjects");
    // The SubjectsDashboard component will handle showing the add subject popup
  };

  return (
    <div>
      <div className="stats-container">
        <div className="stat-card">
          <h3>{stats.totalSubjects}</h3>
          <p>Total Subjects</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalChapters}</h3>
          <p>Total Chapters</p>
        </div>
        <div className="stat-card">
          <h3>{stats.activeUsers}</h3>
          <p>Active Users</p>
        </div>
        <div className="stat-card">
          <h3>{stats.completionRate}%</h3>
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
            <button className="action-button" onClick={handleAddSubject}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add New Subject
            </button>
            <button
              className="action-button"
              onClick={exportToPDF}
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {isLoading ? "Loading..." : "Export Report"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
