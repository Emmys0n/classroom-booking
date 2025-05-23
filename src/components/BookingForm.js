import React, { useState } from 'react';

const BookingForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    user: '',
    comment: '',
    isPermanent: false,
    ...initialData
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      permanent: formData.isPermanent
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Ваше имя:</label>
        <input
          type="text"
          name="user"
          value={formData.user}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Комментарий:</label>
        <input
          type="text"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
        />
      </div>

      <div className="form-group checkbox">
        <label>
          <input
            type="checkbox"
            name="isPermanent"
            checked={formData.isPermanent}
            onChange={handleChange}
          />
          Постоянное бронирование
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit">
          Забронировать
        </button>
        <button 
          type="button" 
          className="btn-cancel"
          onClick={onCancel}
        >
          Отмена
        </button>
      </div>
    </form>
  );
};

export default BookingForm;