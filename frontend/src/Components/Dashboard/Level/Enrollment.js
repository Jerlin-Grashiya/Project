import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Enrollment({ onCancel, courseCode }) {
    const [batchNameOptions, setBatchNameOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [batchName, setBatchName] = useState('');
    const [department, setDepartment] = useState('');
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');
    const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
    const [fetchingStudents, setFetchingStudents] = useState(false); // Loading state
    const [enrolledBatch, setEnrolledBatch] = useState(false); // State to track if batch is enrolled

    useEffect(() => {
        // Fetch batch data for dropdown options
        const fetchBatchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/batches');
                const batches = response.data;
                const distinctBatchNames = [...new Set(batches.map(batch => batch.name))];
                const distinctDepartments = [...new Set(batches.map(batch => batch.department))];
                setBatchNameOptions(distinctBatchNames);
                setDepartmentOptions(distinctDepartments);
            } catch (error) {
                console.error('Error fetching batch data:', error);
            }
        };

        fetchBatchData();
    }, []);

    useEffect(() => {
        // Fetch students when batchName or department changes
        const fetchStudentsData = async () => {
            if (batchName && department) {
                try {
                    const response = await axios.get('http://localhost:3000/batches', {
                        params: {
                            name: batchName,
                            department: department
                        }
                    });
                    const batchData = response.data;
                    const selectedBatch = batchData.find(batch => batch.name === batchName && batch.department === department);
                    if (selectedBatch) {
                        setStudents(selectedBatch.students);
                    } else {
                        setStudents([]);
                    }
                } catch (error) {
                    console.error('Error fetching students:', error);
                    setError('Error fetching students');
                }
            }
        };

        fetchStudentsData();
    }, [batchName, department]); // Trigger when batchName or department changes

    const handleEnroll = async () => {
        try {
            // Prevent multiple clicks while fetch operation is in progress
            if (fetchingStudents) {
                return;
            }

            // Set loading state to true
            setFetchingStudents(true);

            // Reset error message
            setError('');

            // Check if students array is empty
            if (students.length === 0) {
                setError('No students available for enrollment');
                return;
            }

            // Check if batch is already enrolled
            if (enrolledBatch) {
                setError('Batch is already enrolled');
                return;
            }

            // initializing marks array with null values
            const marksArray = students.map(() => null);

            // Make the POST request to enroll students
            await axios.post('http://localhost:3000/assessments', {
                courseCode,
                studentArray: students.map(({ regNo, indexNo, name }) => ({ regNo, indexNo, name })),
                marksArray
            });

            // Set enrollment success to true
            setEnrollmentSuccess(true);

            // Set batch as enrolled
            setEnrolledBatch(true);
        } catch (error) {
            console.error('Error enrolling students:', error);
            setError('Error enrolling students');
        } finally {
            // Set loading state to false after fetch operation completes
            setFetchingStudents(false);
        }
    };

    const handleClose = () => {
        onCancel();
    };

    return (
        <div>
            <h2>Enroll in Course</h2>
            {error && <div>{error}</div>}
            {enrollmentSuccess && !error && <span>You have successfully enrolled!</span>}
           
            <select value={batchName} onChange={(e) => setBatchName(e.target.value)}>
                <option value="">Select Batch</option>
                {batchNameOptions.map((batchName, index) => (
                    <option key={index} value={batchName}>{batchName}</option>
                ))}
            </select>
            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option value="">Select Department</option>
                {departmentOptions.map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                ))}
            </select>
            <button onClick={handleEnroll}>Enroll</button>
            <button onClick={handleClose}>Close</button>
        </div>
    );
}
