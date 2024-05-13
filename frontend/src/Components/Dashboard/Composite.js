import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios';

export default function Composite(){
    const location = useLocation();
    const initialLecturerID = location.state.lecturerID;
    const [lecturerID, setLecturerID] = useState(initialLecturerID);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [exam, setExam] = useState('');
    const [isTheory, setIsTheory] = useState(false);
    const [isPractical, setIsPractical] = useState(false);
    const [students, setStudents] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [marksArray, setMarksArray] = useState({});
    const [icaMarks, setICAMarks] = useState({});
    const [averageICAMarks, setAverageICAMarks] = useState({});

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/users/${lecturerID}/enrolledCourses`);
                setCourses(response.data);
            } catch (error) {
                console.error("Error in fetching the courses:", error);
                setError("Failed to fetch the courses");
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

    const fetchMarksArray = async (courseCode) => {
        try {
            const response = await axios.get(`http://localhost:3000/assessments/${courseCode}/marksArray`);
            setMarksArray(response.data.marksArray);
            setError('');
        } catch (error) {
            console.error('Error fetching marks array:', error);
            setError('Failed to fetch marks array.');
        }
    };

    const fetchFinalMarksArray = async (courseCode) => {
        try {
            const response = await axios.get(`http://localhost:3000/finalexams/${courseCode}/marksArray`);
            setMarksArray(response.data.marksArray);
            console.log("a",response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching marks array:', error);
            setError('Failed to fetch marks array.');
        }
    };

    const handleCourseChange = async (e) => {
        const courseCode = e.target.value;
        setSelectedCourse(courseCode);

        try {
            const courseDetailsResponse = await axios.get(`http://localhost:3000/courses/${courseCode}/details`);
            const courseDetails = courseDetailsResponse.data;

            if (courseDetails.theoryCredit > 0 && courseDetails.practicalCredit > 0) {
                setIsTheory(true);
                setIsPractical(true);
            } else if (courseDetails.theoryCredit > 0) {
                setIsTheory(true);
                setIsPractical(false);
            } else if (courseDetails.practicalCredit > 0) {
                setIsTheory(false);
                setIsPractical(true);
            }

            fetchStudents(courseCode);
            fetchMarksArray(courseCode);
            fetchFinalMarksArray(courseCode);
        } catch (error) {
            console.error('Error fetching course details:', error);
            setError('Failed to fetch course details.');
        }
    };

    const handleExamChange = (e) => {
        setExam(e.target.value);
    };

    const renderICAMarks = (student) => {
        if (icaMarks && icaMarks[`ICA1`] && icaMarks[`ICA2`] && icaMarks[`ICA3`]) {
            return (
                <React.Fragment>
                    <td>{icaMarks[`ICA1`].find(mark => mark.regNo === student.regNo)?.marks || '-'}</td>
                    <td>{icaMarks[`ICA2`].find(mark => mark.regNo === student.regNo)?.marks || '-'}</td>
                    <td>{icaMarks[`ICA3`].find(mark => mark.regNo === student.regNo)?.marks || '-'}</td>
                    <td>{calculateAverageICAMarks(student)}</td>
                </React.Fragment>
            );
        }
        return null;
    };

    const renderFinalMarks = (student) => {
        if (marksArray && marksArray.firstMarking && marksArray.secondMarking) {
            const firstMarkEntry = marksArray.firstMarking.flat().find(mark => {
                return mark.regNo === student.regNo && mark.exam[0]?.examType === exam;
            });
            const firstMark = firstMarkEntry ? parseFloat(firstMarkEntry.exam[0]?.totalMarks) || 0 : 0;
    
            // Find the exam entry for the student in the second marking based on examType
            const secondMarkEntry = marksArray.secondMarking.flat().find(mark => {
                return mark.regNo === student.regNo && mark.exam[0]?.examType === exam;
            });
            const secondMark = secondMarkEntry ? parseFloat(secondMarkEntry.exam[0]?.totalMarks) || 0 : 0;
    
            // Calculate the average of first and second markings
            const averageMarks = (firstMark + secondMark) / 2 || 0;
            const finalMarksGradePercentage = isTheory ? 0.7 : 0.6;
            const icaAverage = calculateAverageICAMarks(student);
            const finalMarksGradeValue = (finalMarksGradePercentage * averageMarks) + ((1 - finalMarksGradePercentage) * icaAverage);

            let grade = '';
            if (finalMarksGradeValue >= 80) {
                grade = 'A+';
            } else if (finalMarksGradeValue >= 75) {
                grade = 'A';
            } else if (finalMarksGradeValue >= 70) {
                grade = 'A-';
            } else if (finalMarksGradeValue >= 65) {
                grade = 'B+';
            } else if (finalMarksGradeValue >= 60) {
                grade = 'B';
            } else if (finalMarksGradeValue >= 55) {
                grade = 'B-';
            } else if (finalMarksGradeValue >= 50) {
                grade = 'C+';
            } else if (finalMarksGradeValue >= 45) {
                grade = 'C';
            } else if (finalMarksGradeValue >= 40) {
                grade = 'C-';
            } else if (finalMarksGradeValue >= 35) {
                grade = 'D+';
            } else if (finalMarksGradeValue >= 30) {
                grade = 'D';
            } else {
                grade = 'E';
            }

            return (
                <React.Fragment>
                    <td>{firstMark}</td>
                    <td>{secondMark}</td>
                    <td>{averageMarks}</td>
                    <td>{finalMarksGradeValue.toFixed(2)}</td>
                    <td>{grade}</td>
                </React.Fragment>
            );
        }
        return null;
    };
    
    

    const calculateAverageICAMarks = (student) => {
        const ica1 = parseFloat(icaMarks[`ICA1`].find(mark => mark.regNo === student.regNo)?.marks || 0);
        const ica2 = parseFloat(icaMarks[`ICA2`].find(mark => mark.regNo === student.regNo)?.marks || 0);
        const ica3 = parseFloat(icaMarks[`ICA3`].find(mark => mark.regNo === student.regNo)?.marks || 0);
    
        const sortedMarks = [ica1, ica2, ica3].sort((a, b) => b - a);
        const average = (sortedMarks[0] + sortedMarks[1]) / 2;
    
        return average || '-';
    };
    
    useEffect(() => {
        if (selectedCourse && exam) {
            if (marksArray && marksArray[exam]) {
                setICAMarks(marksArray[exam]);
            }
        }
    }, [selectedCourse, exam, marksArray]);

    
    const handleClick = () => {
        setShowTable(true);
    };

    const handleCancel = () => {
        setShowTable(false);
    };

    return (
        <div>
            <h2>Composite Sheet</h2>
            <div>
                <label>Select course</label>
                <select value={selectedCourse} onChange={handleCourseChange}>
                    <option value="">Select the course</option>
                    {courses.map((course, index) => (
                        <option key={index} value={course.code}>{course}</option>
                    ))}
                </select>
            </div>

            {(isTheory || isPractical) && (
                <div>
                    <label>Select Exam Type:</label>
                    <select value={exam} onChange={handleExamChange}>
                        <option value="">Select Exam Type</option>
                        {isTheory && <option value="theory">Theory</option>}
                        {isPractical && <option value="practical">Practical</option>}
                    </select>
                </div>
            )}
<button onClick={handleClick}>View</button>
            {showTable && (
                <div className="overlay">
                <div className="overlay-content">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Reg No</th>
                            <th>Index No</th>
                            <th>Name</th>
                            <th>ICA 1</th>
                            <th>ICA 2</th>
                            <th>ICA 3</th>
                            <th>Average of Best Two ICAs</th>
                            <th>First Marking</th>
                            <th>Second Marking</th>
                            <th>Average of Marking</th>
                            <th>Final Marks</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={index}>
                                <td>{student.regNo}</td>
                                <td>{student.indexNo}</td>
                                <td>{student.name}</td>
                                {renderICAMarks(student)}
                                {renderFinalMarks(student)}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={handleCancel} className="no-print">Cancel</button>
                        
                </div>
                </div>
            )}
                        
                        
            {error && <div>{error}</div>}
        </div>
    );
}
