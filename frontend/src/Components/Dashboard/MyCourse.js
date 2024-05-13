import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";

export default function MyCourse() {
    const location = useLocation();
    const initialLecturerID = location.state.lecturerID; // Get initial lecturerID from location state
    const [lecturerID, setLecturerID] = useState(initialLecturerID);
    const [courses, setCourses] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [error, setError] = useState('');
    const [enrolledCourses, setEnrolledCourses] = useState(new Set()); // Use Set to prevent duplicates

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Fetch courses from the backend
                const response = await axios.get(`http://localhost:3000/courses`);
                setCourses(response.data);
            } catch (error) {
                setError('Error fetching courses');
            }
        };

        // Fetch enrolled courses for the current lecturer from the backend
        const fetchEnrolledCourses = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/users/${lecturerID}/enrolledCourses`);
                setEnrolledCourses(new Set(response.data)); // Assuming the response contains an array of course codes
            } catch (error) {
                console.error('Error fetching enrolled courses:', error);
            }
        };

        fetchCourses();
        fetchEnrolledCourses(); // Fetch enrolled courses when the component mounts or when the lecturerID changes
    }, [lecturerID]);

    const filteredCourses = courses.filter(course => {
        const levelMatch = selectedLevel ? parseInt(course.level) === parseInt(selectedLevel) : true;
        const departmentMatch = selectedDepartment ? course.department === selectedDepartment : true;
        return levelMatch && departmentMatch;
    });

    const handleCheckboxChange = async (courseCode) => {
        try {
            if (enrolledCourses.has(courseCode)) {
                const updatedEnrolledCourses = new Set(enrolledCourses);
                updatedEnrolledCourses.delete(courseCode);
                setEnrolledCourses(updatedEnrolledCourses);
                await axios.post(`http://localhost:3000/users/removeCourse`, { lecturerID, courseCode });
            } else {
                const updatedEnrolledCourses = new Set(enrolledCourses);
                updatedEnrolledCourses.add(courseCode);
                setEnrolledCourses(updatedEnrolledCourses);
                await axios.post(`http://localhost:3000/users/addCourse`, { lecturerID, courseCode });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const departments = [...new Set(courses.map(course => course.department))];

    return (
        <div>
            <h2>My Courses</h2>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <div style={{ marginRight: "30px" }}>
                    <label>Select Level:</label>
                    <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
                        <option value="">All Levels</option>
                        <option value="1">Level 1</option>
                        <option value="2">Level 2</option>
                        <option value="3">Level 3</option>
                        <option value="4">Level 4</option>
                    </select>
                </div>
                <div>
                    <label>Select Department:</label>
                    <select style={{ width: "130px" }} value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                        <option value="">All Departments</option>
                        {departments.map(department => (
                            <option key={department} value={department}>{department}</option>
                        ))}
                    </select>
                </div>
            </div>
            <br/><br/>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Enroll</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCourses.map(course => (
                            <tr key={course.code}>
                                <td>{course.code}</td>
                                <td>{course.name}</td>
                                <td><input type="checkbox" onChange={() => handleCheckboxChange(course.code)} checked={enrolledCourses.has(course.code)} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
