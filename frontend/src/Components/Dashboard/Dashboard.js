import React, { useState } from 'react';
import Level1 from './Level/Level1';
import Level2 from './Level/Level2';
import Level3 from './Level/Level3';
import Level4 from './Level/Level4';

export default function Dashboard({ selectedCourses }) {
  const [level, setLevel] = useState(null);

  const showLevel = (selectedLevel) => {
    setLevel(selectedLevel);
  };

  let content;
  switch(level) {
    case 'level1':
      content = <Level1 selectedCourses={selectedCourses} />;
      break;
    case 'level2':
      content = <Level2 selectedCourses={selectedCourses} />;
      break;
    case 'level3':
      content = <Level3 selectedCourses={selectedCourses} />;
      break;
    case 'level4':
      content = <Level4 selectedCourses={selectedCourses} />;
      break;
    default:
      content = (
        <div>
          <h2>Dashboard</h2><br/>
          <ol>
            <li onClick={() => showLevel('level1')}>Level I</li>
            <li onClick={() => showLevel('level2')}>Level II</li>
            <li onClick={() => showLevel('level3')}>Level III</li>
            <li onClick={() => showLevel('level4')}>Level IV</li>
          </ol>
        </div>
      );
  }

  return (
    <div>
      <div>
        {content}
      </div>
    </div>
  );
}
