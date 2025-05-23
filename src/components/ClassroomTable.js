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

    return schedule.map((row, rowIndex) => {
      const currentDay = row[0]?.text?.trim() || '';
      const isNewDay = currentDay && currentDay !== lastDay;

      if (isNewDay) lastDay = currentDay;

      return (
        <React.Fragment key={`row-${rowIndex}`}>
          {isNewDay && rowIndex > 0 && (
            <tr className="day-divider">
              {row.map((_, i) => <td key={`div-${i}`} />)}
            </tr>
          )}

          <tr>
            {row.map((cell, cellIndex) => (
              <td
                key={`cell-${cellIndex}`}
                className={`cell ${cell.color} ${cell.hasComment ? 'has-comment' : ''}`}
              >
                {cell.text}
                {cell.comment && (
                  <div 
                    className="comment-indicator"
                    title={cell.comment}
                  />
                )}
              </td>
            ))}
          </tr>
        </React.Fragment>
      );
    });
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