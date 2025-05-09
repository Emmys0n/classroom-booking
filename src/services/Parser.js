// src/services/Parser.js
import Papa from 'papaparse';

// Функция парсинга CSV файла
export const parseCSVFile = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,         // Используем первую строку как заголовки колонок
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};
