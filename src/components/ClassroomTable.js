import React, { useState, useEffect } from 'react';
import { parseExcelFile } from '../services/Parser';
import { getBookings, addBooking } from '../services/bookingStorage';
import BookingForm from './BookingForm';
import './ClassroomTable.css';

const ClassroomTable = () => {
  const [schedule, setSchedule] = useState([]);
  const [parsed, setParsed] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);

  // Загрузка бронирований при монтировании
  useEffect(() => {
    setBookings(getBookings());
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = await parseExcelFile(file);
    setSchedule(data);
    setParsed(true);
  };

  const handleCellClick = (rowIndex, cellIndex) => {
    if (!schedule[1] || !schedule[rowIndex]) return;

    const classroom = schedule[1][cellIndex]?.text;
    const time = schedule[rowIndex][1]?.text;
    const day = schedule[rowIndex][0]?.text;

    if (classroom && time) {
      setSelectedCell({
        day: typeof day === 'string' ? day.trim() : '',
        time: typeof time === 'string' ? time.trim() : '',
        classroom: typeof classroom === 'string' ? classroom.trim() : '',
        rowIndex,
        cellIndex
      });
    }
  };

  const handleBookingSubmit = (bookingData) => {
    const newBooking = {
      ...bookingData,
      date: selectedCell.day,
      time: selectedCell.time,
      classroom: selectedCell.classroom
    };
    
    addBooking(newBooking);
    setBookings([...bookings, newBooking]);
    setSelectedCell(null);
    alert(`Аудитория ${newBooking.classroom} успешно забронирована!`);
  };

  const isCellBooked = (day, time, classroom) => {
    return bookings.find(b => {
      const isSameClassroom = b.classroom === classroom;
      const isSameTime = b.time === time;
      const isPermanentOrSameDay = b.permanent || b.date === day;
      
      return isSameClassroom && isSameTime && isPermanentOrSameDay;
    });
  };
  
  const renderRows = () => {
    if (!schedule.length) return null;
  
    let lastDay = ''; // Добавляем объявление переменной
    let visualDayIndex = -1;
  
    return schedule.map((row, rowIndex) => {
      const currentDay = typeof row[0]?.text === 'string' ? row[0].text.trim() : '';
      const isNewDay = currentDay && currentDay !== lastDay;
  
      if (isNewDay) {
        lastDay = currentDay;
        visualDayIndex = 0;
      } else {
        visualDayIndex++;
      }
  
      const isStriped = visualDayIndex % 2 === 1;
  
      return (
        <React.Fragment key={`row-${rowIndex}`}>
          {isNewDay && rowIndex > 0 && (
            <tr className="day-divider">
              {row.map((_, i) => <td key={`div-${i}`} />)}
            </tr>
          )}
          <tr className={isStriped ? 'striped-row' : ''}>
            {row.map((cell, cellIndex) => {
              const classroom = schedule[1]?.[cellIndex]?.text;
              const time = row[1]?.text;
              
              const classroomStr = typeof classroom === 'string' ? classroom.trim() : '';
              const timeStr = typeof time === 'string' ? time.trim() : '';
              const dayStr = typeof currentDay === 'string' ? currentDay.trim() : '';
  
              const booking = classroomStr && timeStr 
                ? isCellBooked(dayStr, timeStr, classroomStr)
                : null;
  
              const bgClass = booking
                ? (booking.permanent ? 'permanent' : 'temporary')
                : cell.color || '';
  
              return (
                <td
                  key={`cell-${cellIndex}`}
                  className={`cell ${bgClass} ${cell.hasComment ? 'has-comment' : ''}`}
                  onClick={() => handleCellClick(rowIndex, cellIndex)}
                >
                  {cell.text}
                  {cell.comment && (
                    <div className="comment-indicator" title={cell.comment} />
                  )}
                  {booking && (
                    <div className="booking-indicator">
                      {booking.user?.charAt(0) || '!'}
                    </div>
                  )}
                </td>
              );
            })}
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

      {selectedCell && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Бронирование аудитории {selectedCell.classroom}</h3>
            <p>День: {selectedCell.day}</p>
            <p>Время: {selectedCell.time}</p>
            
            <BookingForm
              onSubmit={handleBookingSubmit}
              onCancel={() => setSelectedCell(null)}
              initialData={{
                classroom: selectedCell.classroom,
                time: selectedCell.time,
                date: selectedCell.day
              }}
            />
          </div>
        </div>
      )}

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