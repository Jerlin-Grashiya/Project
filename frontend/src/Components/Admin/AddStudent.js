import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddStudent() {
    const [regNo, setRegNo] = useState('');
    const [indexNo, setIndexNo] = useState('');
    const [name, setName] = useState('');
    const [batchID, setBatchID] = useState('');
    const [department, setDepartment] = useState('');
    const [distinctBatchNames, setDistinctBatchNames] = useState([]);
    const [distinctDepartments, setDistinctDepartments] = useState([]);
    const [error, setError] = useState(null);

    // State to store selected batch and department
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');

    useEffect(() => {
        // Fetch batch names and departments
        const fetchBatches = async () => {
            try {
                const response = await axios.get('http://localhost:3000/batches');
                const distinctNames = [...new Set(response.data.map(batch => batch.name))];
                const distinctDepts = [...new Set(response.data.map(batch => batch.department))];
                setDistinctBatchNames(distinctNames);
                setDistinctDepartments(distinctDepts);
            } catch (error) {
                console.error('Error fetching batches:', error);
                setError('Error fetching batches: ' + error.message);
            }
        };

        fetchBatches();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Check if any field is empty
            if (!regNo || !indexNo || !name || !batchID || !department) {
                setError('All fields are required');
                return;
            }
    
            // Make a POST request to add the student
            await axios.post('http://localhost:3000/batches/registerStudent', { regNo, indexNo, name, batchName: batchID, department });
            
            // Reset form fields and error
            setRegNo('');
            setIndexNo('');
            setName('');
            setError(null);
    
            console.log('Student added successfully');
        } catch (error) {
            console.error('Error adding student:', error);
            setError('Error adding student: ' + error.message);
        }
    };

    // Function to handle batch selection
    const handleBatchChange = (e) => {
        setBatchID(e.target.value);
        setSelectedBatch(e.target.value);
    };

    // Function to handle department selection
    const handleDepartmentChange = (e) => {
        setDepartment(e.target.value);
        setSelectedDepartment(e.target.value);
    };
    
    return (
        <div>
            {error && <div>Error: {error}</div>}
            <form onSubmit={handleSubmit}>
                <h2>Add Student</h2>

                <label>
                    Select Batch:
                    <select value={selectedBatch} onChange={handleBatchChange}>
                        <option value="">Select Batch</option>
                        {distinctBatchNames.map((batchName, index) => (
                            <option key={index} value={batchName}>{batchName}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Select Department:
                    <select value={selectedDepartment} onChange={handleDepartmentChange}>
                        <option value="">Select Department</option>
                        {distinctDepartments.map((dept, index) => (
                            <option key={index} value={dept}>{dept}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Registration Number:
                    <input type="text" value={regNo} onChange={(e) => setRegNo(e.target.value)} />
                </label>

                <label>
                    Index Number:
                    <input type="text" value={indexNo} onChange={(e) => setIndexNo(e.target.value)} />
                </label>

                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>

                <button type="submit">Add Student</button>
            </form>
        </div>
    );
}
