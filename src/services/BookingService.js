const STORAGE_KEY = 'classroomBookings';

function getAllBookings() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

function saveAllBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function saveBooking(key, value) {
  const bookings = getAllBookings();
  bookings[key] = value;
  saveAllBookings(bookings);
}

export function getBooking(key) {
  const bookings = getAllBookings();
  return bookings[key] || null;
}

export function getAllBookingEntries() {
  return getAllBookings();
}

export function deleteBooking(key) {
  const bookings = getAllBookings();
  delete bookings[key];
  saveAllBookings(bookings);
}
