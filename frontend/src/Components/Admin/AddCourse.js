import React, { useState } from 'react';
import axios from 'axios';

export default function AddCourse() {
  const [level, setlevel] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [theoryCredits, setTheoryCredits] = useState('');
  const [practicalCredits, setPracticalCredits] = useState('');
  const [department, setDepartment] = useState('IT'); // Default department is IT
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate credits
    const theoryCreditsNumber = parseInt(theoryCredits);
    const practicalCreditsNumber = parseInt(practicalCredits);

    if (isNaN(theoryCreditsNumber) || isNaN(practicalCreditsNumber) || theoryCreditsNumber < 0 || practicalCreditsNumber < 0) {
      setError('Credits must be numeric values greater than or equal to 0');
      return;
    }

    try {
      await axios.post('http://localhost:3000/courses/add', {
        level,
        code,
        name,
        theoryCredits,
        practicalCredits,
        department
      });
      setlevel('');
      setCode('');
      setName('');
      setTheoryCredits('');
      setPracticalCredits('');
      setError('');
      console.log('Course added successfully');
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Add Course</h2>
        <label htmlFor="levelInput">Level:</label>
        <input id="levelinput" type="number" value={level} onChange={(e) => setlevel(e.target.value)} />

        <label htmlFor="codeInput">Course Code:</label>
        <input id="codeInput" type="text" value={code} onChange={(e) => setCode(e.target.value)} />
        
        <label htmlFor="nameInput">Course Name:</label>
        <input id="nameInput" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        
        <label htmlFor="theoryCreditsInput">Theory Credits:</label>
        <input id="theoryCreditsInput" type="number" value={theoryCredits} onChange={(e) => setTheoryCredits(e.target.value)} />
        
        <label htmlFor="practicalCreditsInput">Practical Credits:</label>
        <input id="practicalCreditsInput" type="number" value={practicalCredits} onChange={(e) => setPracticalCredits(e.target.value)} />

        <label htmlFor="departmentSelect">Department:</label>
        <select id="departmentSelect" value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="IT">IT</option>
          <option value="AMC">AMC</option>
        </select>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Add Course</button>
      </form>
    </div>
  );
}
