import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Enrollment from './Enrollment';
import MarksUp from '../MarksUp';

export default function Level1() {
    const location = useLocation();
    const initialLecturerID = location.state.lecturerID;
    const [lecturerID, setLecturerID] = useState(initialLecturerID);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
    const [showMarksUpForm, setShowMarksUpForm] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/users/${lecturerID}/courses`, {
                    params: { level: 1 }
                });
                setCourses(response.data);
            } catch (error) {
                console.error(error);
                setError('Error fetching level 1 courses: ' + error.message);
            }
        };

        fetchCourses();
    }, [lecturerID]);

    const handleEnrollment = (course) => {
        setSelectedCourse(course);
        setShowEnrollmentForm(true);
        setShowMarksUpForm(false);
    };

    const handleCourseClick = (course) => {
        setSelectedCourse(course);
    };

    const handleCancelEnrollment = () => {
        setShowEnrollmentForm(false);
        setShowMarksUpForm(false);
    };

    return (
        <div>
            {error && <div>Error: {error}</div>}
            <h2>My courses</h2>
            <ol>
                {courses.map(course => (
                    <li key={course.id} onClick={() => handleCourseClick(course)}>
                        {course.code} - {course.name}
                        <button onClick={() => handleEnrollment(course)}>Enroll</button>
                    </li>
                ))}
            </ol>
            {showEnrollmentForm && selectedCourse && (
                <div className='enrollment-form-overlay'>
                    <div className='enrollment-form'>
                        <Enrollment
                            courseCode={selectedCourse.code} 
                            onCancel={handleCancelEnrollment}
                        />
                    </div>
                </div>
            )}
            {selectedCourse && !showEnrollmentForm && (
                <div className='enrollment-form-overlay'>
                    <div className='enrollment-form'>
                        <p>Selected Course Code: {selectedCourse.code}</p> {/* Print the course code */}
                        <MarksUp
                            courseCode={selectedCourse.code} // Pass course code as prop to MarksUp component
                            onCancel={() => setSelectedCourse(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}