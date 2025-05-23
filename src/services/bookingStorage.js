const STORAGE_KEY = 'classroom_bookings';

export const getBookings = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const addBooking = (booking) => {
  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
};

export const removeBooking = (index) => {
  const bookings = getBookings();
  bookings.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
};

export const clearBookings = () => {
  localStorage.removeItem(STORAGE_KEY);
};