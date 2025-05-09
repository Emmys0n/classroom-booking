// src/components/ClassroomTable.js
import React, { useState } from 'react';
import { parseCSVFile } from '../services/Parser';

const ClassroomTable = () => {
  const [schedule, setSchedule] = useState([]);

  // Загрузка файла и парсинг
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const data = await parseCSVFile(file);
      setSchedule(data);
    }
  };

  return (
    <div>
      <h2>Загрузка расписания</h2>
      <input type="file" onChange={handleFileUpload} accept=".csv" />
      
      {schedule.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(schedule[0]).map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedule.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClassroomTable;
