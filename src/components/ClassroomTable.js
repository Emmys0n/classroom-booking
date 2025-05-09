// src/components/ClassroomTable.js
import React, { useState } from 'react';
import { parseExcelFile } from '../services/Parser';
import './ClassroomTable.css';

const ClassroomTable = () => {
  const [schedule, setSchedule] = useState([]);
  const [parsed, setParsed] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const data = await parseExcelFile(file);
      setSchedule(data);
      setParsed(true);
    }
  };

  const renderCell = (cell, cellIndex) => {
    return (
      <td
        key={cellIndex}
        className={`cell ${cell.color}`}
      >
        {cell.text}
      </td>
    );
  };

  const renderRows = () => {
    const rows = [];
    for (let i = 0; i < schedule.length; i++) {
      // Добавляем обычную строку
      rows.push(
        <tr key={`row-${i}`}>
          {schedule[i].map(renderCell)}
        </tr>
      );

      // Если это конец блока 21 строк, добавляем разделитель
      if ((i + 1) % 21 === 0 && i !== schedule.length - 1) {
        rows.push(
          <tr key={`divider-${i}`} className="day-divider">
            <td colSpan={schedule[i].length} />
          </tr>
        );
      }
    }
    return rows;
  };

  return (
    <div className="classroom-container">
      <h2>Загрузка расписания из Excel</h2>
      <input type="file" onChange={handleFileUpload} accept=".xlsx, .xls" />

      {parsed ? (
        <div className="table-wrapper">
          <table className="styled-table">
            <tbody>
              {renderRows()}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty-message">Выберите Excel файл с расписанием</p>
      )}
    </div>
  );
};

export default ClassroomTable;
