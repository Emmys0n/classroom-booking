// src/services/Parser.js
import * as XLSX from 'xlsx';

export const parseExcelFile = async (file) => {
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });

    // Первый лист
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Получаем диапазон ячеек
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const rows = [];

    // Проходим по всем строкам и колонкам
    for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
      const row = [];
      for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
        const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
        const cell = worksheet[cellAddress];

        let color = '';

        // Проверяем, есть ли комментарий (примечание)
        if (cell?.c && cell.c.length > 0) {
          color = 'occupied'; // Если есть примечание — зелёный
        }

        row.push({
          text: cell ? cell.v : '',
          color: color,
        });
      }
      rows.push(row);
    }
    
    return rows;
  } catch (error) {
    console.error("Ошибка при парсинге Excel:", error);
    return [];
  }
};
