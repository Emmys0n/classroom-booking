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
  const [weekType, setWeekType] = useState('Числитель');

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

  // Группировка по дням и рендер всей таблицы
  const renderRows = () => {
    if (!schedule.length) return null;

    let lastDay = '';
    let dayRows = [];
    let rows = [];

    // Группируем по дням
    schedule.forEach((row, rowIndex) => {
      const currentDay = typeof row[0]?.text === 'string' ? row[0].text.trim() : '';
      const isNewDay = currentDay && currentDay !== lastDay;
      
      if (isNewDay) {
        if (dayRows.length > 0) {
          processDayRows(lastDay, dayRows, rows);
          dayRows = [];
        }
        lastDay = currentDay;
      }
      dayRows.push({ row, rowIndex });
    });

    // Последний день
    if (dayRows.length > 0) {
      processDayRows(lastDay, dayRows, rows);
    }

    return rows;
  };

  // Вот здесь просто выводим все строки подряд, фильтруя только по числитель/знаменатель
  const processDayRows = (day, dayRows, outputRows) => {
    if (dayRows.length === 0) return;
  
    // Добавляем разделитель между днями
    if (outputRows.length > 0) {
      outputRows.push(
        <tr key={`div-${day}`} className="day-divider">
          {dayRows[0].row.map((_, i) => <td key={`div-${i}`} />)}
        </tr>
      );
    }
  
    // Обрабатываем каждую строку дня
    dayRows.forEach(({ row, rowIndex }, k) => {
      // Первые 4 строки (заголовки) показываем всегда
      const isHeaderRow = rowIndex < 4;
      
      // Для числителя пропускаем последнюю строку (если это не заголовок)
      if (weekType === 'Числитель' && !isHeaderRow && k === dayRows.length - 1) {
        return;
      }
  
      // Для остальных строк применяем фильтр по типу недели
      const shouldShow = isHeaderRow || 
        (weekType === 'Числитель' && k % 2 === 0) ||
        (weekType === 'Знаменатель' && k % 2 !== 0);
  
      if (!shouldShow) return;
  
      const isStriped = !isHeaderRow && k % 2 === 0;
  
      outputRows.push(
        <tr key={`row-${rowIndex}`} className={isStriped ? 'striped-row' : ''}>
          {row.map((cell, cellIndex) => {
            // Для заголовочных строк не проверяем бронирования
            if (isHeaderRow) {
              return (
                <td
                  key={`cell-${cellIndex}`}
                  className={`cell ${cell.color || ''} ${cell.hasComment ? 'has-comment' : ''}`}
                >
                  {cell.text}
                  {cell.comment && (
                    <div className="comment-indicator" title={cell.comment} />
                  )}
                </td>
              );
            }
  
            // Для обычных строк проверяем бронирования
            const classroom = schedule[1]?.[cellIndex]?.text;
            const time = row[1]?.text;
            const dayStr = typeof day === 'string' ? day.trim() : '';
            const classroomStr = typeof classroom === 'string' ? classroom.trim() : '';
            const timeStr = typeof time === 'string' ? time.trim() : '';
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
      
      <div className="week-switcher">
        <button
          className={weekType === 'Числитель' ? 'active' : ''}
          onClick={() => setWeekType('Числитель')}
        >
          Числитель
        </button>
        <button
          className={weekType === 'Знаменатель' ? 'active' : ''}
          onClick={() => setWeekType('Знаменатель')}
        >
          Знаменатель
        </button>
      </div>

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
