import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function MarksUp({ courseCode, onCancel }) {
    const [marksArray, setMarksArray] = useState([]);
    const [assessmentTypes, setAssessmentTypes] = useState([]);
    const [selectedAssessmentType, setSelectedAssessmentType] = useState('');
    const [selectedICA, setSelectedICA] = useState('');

    useEffect(() => {
        const fetchMarksArray = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/assessments/${courseCode}/marksArray`);
                setMarksArray(response.data.marksArray);
                // Extract assessment types from marksArray
                const types = Object.keys(response.data.marksArray);
                setAssessmentTypes(types);
            } catch (error) {
                console.error('Error fetching marks array:', error);
            }
        };

        fetchMarksArray();
    }, [courseCode]);

    const handleAssessmentTypeChange = (e) => {
        setSelectedAssessmentType(e.target.value);
        // Reset selected ICA when assessment type changes
        setSelectedICA('');
    };

    const handleICAChange = (e) => {
        setSelectedICA(e.target.value);
    };

    const handleUpdate = (regNo) => {
        // Handle update action here
        console.log('Updating record with regNo:', regNo);
    };

    return (
        <div>
            <h2>Marks for Course: {courseCode}</h2>
            <div>
                <label htmlFor="assessmentType">Select Assessment Type:</label>
                <select id="assessmentType" value={selectedAssessmentType} onChange={handleAssessmentTypeChange}>
                    <option value="">Select Assessment Type</option>
                    {assessmentTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>
            {selectedAssessmentType && (
                <div>
                    <label htmlFor="ica">Select ICA:</label>
                    <select id="ica" value={selectedICA} onChange={handleICAChange}>
                        <option value="">Select ICA</option>
                        {marksArray[selectedAssessmentType] && Object.keys(marksArray[selectedAssessmentType]).map(ica => (
                            <option key={ica} value={ica}>{ica}</option>
                        ))}
                    </select>
                </div>
            )}
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>Reg No</th>
                        <th>Marks</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedAssessmentType && selectedICA && marksArray[selectedAssessmentType] && marksArray[selectedAssessmentType][selectedICA] && marksArray[selectedAssessmentType][selectedICA].map(({ regNo, marks }) => (
                        <tr key={`${selectedAssessmentType}-${selectedICA}-${regNo}`}>
                            <td>{regNo}</td>
                            <td>{marks}</td>
                            <td>
                                <button onClick={() => handleUpdate(regNo)} className='no-print'>Update</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
}
