import React, { useState } from 'react';
import axios from 'axios';

export default function AddBatch() {
    const [batchName, setBatchName] = useState('');
    const [department, setDepartment] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Check if the batch name is empty
            if (!batchName.trim()) {
                setError('Batch name cannot be empty');
                return;
            }
    
            // Check if the batch name is distinct
            const existingBatchNames = await axios.get('http://localhost:3000/batches/distinct-names');
            if (existingBatchNames.includes(batchName)) {
                setError('Batch name must be distinct');
                return;
            }
    
            // Make a POST request to create a new batch
            await axios.post(`http://localhost:3000/batches/create`, { name: batchName, department });
    
            setBatchName('');
            setDepartment('');
            console.log('Batch created successfully');
        } catch (error) {
            console.error('Error creating batch:', error);
            setError('Error creating batch: ' + error.message);
        }
    };
    

    return (
        <div>
            {error && <div>Error: {error}</div>}
            <h2>Create a New Batch</h2>
            <form onSubmit={handleSubmit}>
                <label>Enter batch name</label>
                <input type="text" value={batchName} onChange={(e) => setBatchName(e.target.value)} />
                <label>Select Department</label>
                <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                    <option value="">Select Department</option>
                    <option value="IT">IT</option>
                    <option value="AMC">AMC</option>
                </select>
                <button type="submit">Create Batch</button>
            </form>
        </div>
    );
}
