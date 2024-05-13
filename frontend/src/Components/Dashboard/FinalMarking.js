import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function FinalExam() {
    const location = useLocation();
    const initialLecturerID = location.state.lecturerID;
    const [lecturerID, setLecturerID] = useState(initialLecturerID);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [markingType, setMarkingType] = useState('');
    const [exam, setExam] = useState('');
    const [isTheory, setIsTheory] = useState('');
    const [isPractical, setIsPractical] = useState('');
    const [numberOfQuestions, setNumberOfQuestions] = useState(0);
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({});
    const [showTable, setShowTable] = useState(false);

    useEffect(() => {
        if (selectedCourse && markingType) {
            const savedMarks = marks[selectedCourse]?.[markingType] || {};
            setMarksForCurrentCourseAndType(savedMarks);
        }
    }, [selectedCourse, markingType]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/users/${lecturerID}/enrolledcourses`);
                console.log("Courses:", response.data);
                setCourses(response.data);
            } catch (error) {
                console.error("Error in fetching courses", error);
                setError("Failed to fetch courses");
            }
        };
        fetchCourses();
    }, [lecturerID]);

    const fetchStudents = async (courseCode) => {
        try {
            const response = await axios.get(`http://localhost:3000/assessments/${courseCode}/studentArray`);

            if (!Array.isArray(response.data)) {
                throw new Error('Invalid student data');
            }

            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
            setError('Failed to fetch students.');
        }
    };

    const handleMarkingTypeChange = (e) => {
        setMarkingType(e.target.value);
    };
    const handleExamChange = (e) => {
        setExam(e.target.value);
    };

    const handleCourseChange = async (e) => {
        const courseCode = e.target.value;
        setSelectedCourse(courseCode);

        try {
            const courseDetailsResponse = await axios.get(`http://localhost:3000/courses/${courseCode}/details`);
            const courseDetails = courseDetailsResponse.data;

            if (courseDetails.theoryCredit > 0 && courseDetails.practicalCredit > 0) {
                if (exam === '') {
                    setIsTheory(true);
                    setIsPractical(true);
                }
            } else {
                if (exam === '') {
                    setIsTheory(true);
                    setIsPractical(false);
                }
            }

            fetchStudents(courseCode);
        } catch (error) {
            console.error('Error fetching course details:', error);
            setError('Failed to fetch course details.');
        }
    };

    const handleNumberOfQuestionsChange = (e) => {
        const value = parseInt(e.target.value);
        if (value >= 1 && value <= 6) {
            setNumberOfQuestions(value);
        } else {
            console.error('Invalid number of questions');
        }
    };

    const handleMarksChange = (studentRegNo, questionNo, mark) => {
        const updatedMarks = { ...marks };
        if (!updatedMarks[selectedCourse]) {
            updatedMarks[selectedCourse] = {};
        }
        if (!updatedMarks[selectedCourse][markingType]) {
            updatedMarks[selectedCourse][markingType] = {};
        }
        updatedMarks[selectedCourse][markingType][studentRegNo] = {
            ...updatedMarks[selectedCourse][markingType][studentRegNo],
            [questionNo]: mark,
        };
        setMarks(updatedMarks);
    };

    const setMarksForCurrentCourseAndType = (savedMarks) => {
        setMarks(savedMarks);
    };

    const handleClick = () => {
        setShowTable(true);
    };

    const handleCancel = () => {
        setShowTable(false);
    };

    const handleSubmit = async () => {
        try {
            console.log("Submitting marks...");
            const marksData = {
                courseCode: selectedCourse,
                examType: markingType,
                marks: Object.entries(marks[selectedCourse]?.[markingType] || {}).map(([regNo, marks]) => ({
                    regNo,
                    exam: [
                        {
                            examType: exam,
                            marks,
                            totalMarks: Object.values(marks).reduce((acc, curr) => acc + curr, 0),
                            average: Object.values(marks).reduce((acc, curr) => acc + curr, 0) / Object.keys(marks).length
                        }
                    ]
                }))
            };
    
            if (!marksData.marks || typeof marksData.marks !== 'object') {
                console.error('Invalid marks data:', marksData.marks);
                setError('Failed to submit marks. Marks data is invalid.');
                return;
            }
    
            const response = await axios.post('http://localhost:3000/finalexams', marksData);
            console.log("Submit response:", response.data);
    
            if (response.status === 200) {
                setSelectedCourse('');
                setMarkingType('');
                setNumberOfQuestions(0);
                setStudents([]);
                setMarks({});
                setShowTable(false);
                setError('');
                console.log('Marks submitted successfully');
            } else {
                console.error('Failed to submit marks:', response.data);
                setError('Failed to submit marks. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting marks:', error);
            setError('Failed to submit marks. Please try again.');
        }
    };

    const calculateTotalMarks = (studentRegNo) => {
        const studentMarks = marks[selectedCourse]?.[markingType]?.[studentRegNo] || {};
        const totalMarks = Object.values(studentMarks).reduce((acc, curr) => acc + curr, 0);
        return totalMarks || 0;
    };

    const calculateAverageMarks = (studentRegNo) => {
        const studentMarks = marks[selectedCourse]?.[markingType]?.[studentRegNo] || {};
        const totalMarks = calculateTotalMarks(studentRegNo);
        const averageMarks = totalMarks / numberOfQuestions || 0;
        return isNaN(averageMarks) ? 0 : averageMarks.toFixed(2);
    };

    return (
        <div>
            <h2>Final Exam Marking</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div>
                <label>Select the Marking Type</label>
                <select value={markingType} onChange={handleMarkingTypeChange}>
                    <option value="">Select Exam Type</option>
                    <option value="First Marking">First Marking</option>
                    <option value="Second Marking">Second Marking</option>
                </select>
            </div>

            <div>
                <label>Select course</label>
                <select value={selectedCourse} onChange={handleCourseChange}>
                    <option value="">Select the course</option>
                    {courses.map((course, index) => (
                        <option key={index} value={course.code}>{course}</option>
                    ))}
                </select>
            </div>

            {isTheory && isPractical && (
                <div>
                    <label>Select Exam Type:</label>
                    <select value={exam} onChange={handleExamChange}>
                        <option value="">Select Exam Type</option>
                        <option value="theory">Theory</option>
                        <option value="practical">Practical</option>
                    </select>
                </div>
            )}

            <div>
                <label>No of Questions:</label>
                <input type="number" value={numberOfQuestions} placeholder="0" onChange={handleNumberOfQuestionsChange} />
            </div>
            <button onClick={handleClick}>Enter Marks</button>

            {showTable && (
                <div className="overlay">
                    <div className="overlay-content">
                        <table>
                            <thead>
                                <tr>
                                    <th>Reg No</th>
                                    {[...Array(numberOfQuestions)].map((_, index) => (
                                        <th key={index}>Question {index + 1}</th>
                                    ))}
                                    <th>Total Marks</th>
                                    <th>Average Marks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.regNo}>
                                        <td>{student.regNo}</td>
                                        {[...Array(numberOfQuestions)].map((_, index) => (
                                            <td key={index}>
                                                <input
                                                    type="number"
                                                    placeholder={`Question ${index + 1}`}
                                                    value={marks[selectedCourse]?.[markingType]?.[student.regNo]?.[index + 1] || ''}
                                                    onChange={(e) => handleMarksChange(student.regNo, index + 1, parseInt(e.target.value))}
                                                />
                                            </td>
                                        ))}
                                        <td>{calculateTotalMarks(student.regNo)}</td>
                                        <td>{calculateAverageMarks(student.regNo)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={handleSubmit}>Submit</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}
