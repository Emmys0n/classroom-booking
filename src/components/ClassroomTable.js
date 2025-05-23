import React, { useState } from 'react';
import { parseExcelFile } from '../services/Parser';
import './ClassroomTable.css';

const ClassroomTable = () => {
  const [schedule, setSchedule] = useState([]);
  const [parsed, setParsed] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const data = await parseExcelFile(file);
    setSchedule(data);
    setParsed(true);
  };

  const renderRows = () => {
    let lastDay = '';
    let countSinceLastDivider = 0;
    const rows = [];
  
    schedule.forEach((row, rowIndex) => {
      const currentDay = row[0]?.text?.trim() || '';
      const isNewDay = currentDay && currentDay !== lastDay;
  
      if (isNewDay) {
        countSinceLastDivider = 0;
        lastDay = currentDay;
        if (rowIndex > 0) {
          rows.push(
            <tr className="day-divider" key={`day-divider-${rowIndex}`}>
              {row.map((_, i) => <td key={`dd-${i}`} />)}
            </tr>
          );
        }
      } else if (countSinceLastDivider === 2) {
        rows.push(
          <tr className="row-separator" key={`gray-${rowIndex}`}>
            {row.map((_, i) => <td key={`gray-${i}`} />)}
          </tr>
        );
        countSinceLastDivider = 0;
      }
  
      rows.push(
        <tr key={`row-${rowIndex}`}>
          {row.map((cell, cellIndex) => (
            <td key={`cell-${cellIndex}`} className={`cell ${cell.color} ${cell.hasComment ? 'has-comment' : ''}`}>
              <div className="cell-content">
                {cell.text}
                {cell.comment && <span className="comment-indicator" title={cell.comment} />}
              </div>
            </td>
          ))}
        </tr>
      );
  
      countSinceLastDivider++;
    });
  
    return rows;
  };
  
  return (
    <div className="classroom-container">
      <h2>Расписание аудиторий</h2>
      <input
        type="file"
        onChange={handleFileUpload}
        accept=".xlsx, .xls"
      />
      {parsed ? (
        <table className="styled-table">
          <tbody>{renderRows()}</tbody>
        </table>
      ) : (
        <p>Загрузите файл расписания</p>
      )}
    </div>
  );
};

export default ClassroomTable;