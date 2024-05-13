import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";

export default function Level1() {
    const location = useLocation();
    const initialLecturerID = location.state.lecturerID; // Get initial lecturerID from location state
    const [lecturerID, setLecturerID] = useState(initialLecturerID);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Make a request to fetch courses based on the lecturerID and level 1
                const response = await axios.get(`http://localhost:3000/users/${lecturerID}/courses`, {
                    params: { level: 4 }
                });
                setCourses(response.data); // Set the level 1 courses array from the response
            } catch (error) {
                console.error(error);
                setError('Error fetching level 1 courses: ' + error.message);
            }
        };

        fetchCourses();
    }, [lecturerID]);

    return (
        <div>
            {error && <div>Error: {error}</div>}
            <h2>My courses</h2>
            <ol>
                {courses.map(course => (
                    <li key={course.code}>{course.code} - {course.name}</li>
                ))}
            </ol>
        </div>
    );
}
