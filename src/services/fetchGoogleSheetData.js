// src/services/fetchGoogleSheetData.js

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1RTG6BIDQ7cA3XBDkWBeLaBvjaa-LUpBXcDSpfeyYi0U/edit?gid=2136354665#gid=2136354665';

export const fetchGoogleSheetData = async () => {
  try {
    const response = await fetch(SHEET_URL);
    const data = await response.text();
    const rows = data.split('\n').map(row => row.split(','));

    // Преобразуем в массив объектов (если первая строка — заголовки)
    const headers = rows[0];
    const result = rows.slice(1).map(row => {
      return headers.reduce((acc, header, index) => {
        acc[header.trim()] = row[index];
        return acc;
      }, {});
    });

    return result;
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    return [];
  }
};
