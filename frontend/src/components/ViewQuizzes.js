// components/ViewQuizzes.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewQuizzes = ({ subject, goBack }) => {
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/quizzes?subject=${subject._id}`);
                setQuizzes(response.data);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };
        fetchQuizzes();
    }, [subject]);

    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">Quizzes for {subject.name}</h1>
            <button onClick={goBack} className="bg-blue-600 text-white p-2 rounded mb-4">
                Back to Subjects
            </button>
            <div>
                {quizzes.length > 0 ? (
                    quizzes.map((quiz) => (
                        <div key={quiz._id} className="mb-4 p-4 border rounded">
                            <h2 className="text-xl font-semibold">{quiz.title}</h2>
                            <p className="text-gray-600">{quiz.questions.length} questions</p>
                        </div>
                    ))
                ) : (
                    <p>No quizzes available for this subject.</p>
                )}
            </div>
        </div>
    );
};

export default ViewQuizzes;