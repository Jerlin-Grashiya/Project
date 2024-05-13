import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function Assessment() {
    const location=useLocation();
    const initialLecturerID=location.state.lecturerID;
    const [lecturerID,setLecturerID]=useState(initialLecturerID);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [students, setStudents] = useState([]);
    const [marksArray, setMarksArray] = useState({});
    const [assessmentType, setAssessmentType] = useState('');
    const [selectedICA, setSelectedICA] = useState('');
    const [selectedICAMarks, setSelectedICAMarks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [marksInputs, setMarksInputs] = useState({}); // Store marks input for each student
    const [showOverlay, setShowOverlay] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3000/users/${lecturerID}/enrolledcourses`);
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setError('Failed to fetch courses.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const fetchStudents = async (courseCode) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3000/assessments/${courseCode}/studentArray`);
            
            // Check if the response data is an array
            if (!Array.isArray(response.data)) {
                throw new Error('Invalid student data');
            }
            
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
            setError('Failed to fetch students.');
        } finally {
            setLoading(false);
        }
    };
    

    const fetchAssessmentTypes = async (courseCode) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3000/assessments/${courseCode}/marksArray`);
            setMarksArray(response.data.marksArray);
        } catch (error) {
            console.error('Error fetching assessment types:', error);
            setError('Failed to fetch assessment types.');
        } finally {
            setLoading(false);
        }
    };   

    const handleAssessmentTypeChange = (e) => {
        const type = e.target.value;
        setAssessmentType(type);
        setSelectedICA('');
    };

    const handleICAChange = (e) => {
        const ica = e.target.value;
        setSelectedICA(ica);
        setSelectedICAMarks(marksArray[assessmentType][ica]);
        // Initialize marks input for each student when ICA changes
        const inputs = {};
        students.forEach(student => {
            inputs[student.regNo] = '';
        });
        setMarksInputs(inputs);
    };

    useEffect(() => {
        if (selectedCourse) {
            fetchAssessmentTypes(selectedCourse);
            fetchStudents(selectedCourse); // Fetch students when course changes
        }
    }, [selectedCourse]);

    const handleMarksInputChange = (e, regNo) => {
        const newMarksInputs = { ...marksInputs, [regNo]: e.target.value };
        setMarksInputs(newMarksInputs);
    };

    const enterMarks = async () => {
        try {
            const marksData = students.map(student => ({
                regNo: student.regNo, // Include regNo for each student
                marks: marksInputs[student.regNo]
            }));
            await axios.post(`http://localhost:3000/assessments/${selectedCourse}/marksArray`, {
                assessmentType,
                ica: selectedICA,
                marks: marksData
            });
            alert('Marks entered successfully!');
        } catch (error) {
            setError('Failed to enter marks.');
        }
    };
    

    return (
        <div>
            <h2>Enroll Marks</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div>
                <label>Select Course:</label>
                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                    <option value="">Select Course</option>
                    {courses.map((course, index) => (
                        <option key={index} value={course}>{course}</option>
                    ))}
                </select>
            </div>

            <div>
                <label>Select Assessment Type:</label>
                <select value={assessmentType} onChange={handleAssessmentTypeChange}>
                    <option value="">Select Assessment Type</option>
                    {Object.keys(marksArray).map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                    ))}
                </select>
            </div>
            {assessmentType && (
                <div>
                    <h3>{assessmentType}</h3>
                    {marksArray[assessmentType] && (
                        <div>
                            <label>Select ICA:</label>
                            <select value={selectedICA} onChange={handleICAChange}>
                                <option value="">Select ICA</option>
                                {Object.keys(marksArray[assessmentType]).map((ica, index) => (
                                    <option key={index} value={ica}>{ica}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {selectedICA && (
                        <div>
                            <button onClick={() => setShowOverlay(true)}>Enter Marks</button>
                            {showOverlay && (
                                <div className='overlay'>
                                    <div className='overlay-content'>
                                        <h4>Enter Marks:</h4>
                                        {students.map((student, index) => (
                                            <div key={index}>
                                                <label>{student.regNo}:</label>
                                                <input type="text" value={marksInputs[student.regNo] || ''} 
                                                    onChange={(e) => handleMarksInputChange(e, student.regNo)} />
                                            </div>
                                        ))}
                                        <button onClick={enterMarks}>Submit</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
