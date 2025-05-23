import * as XLSX from 'xlsx';

export const parseExcelFile = async (file) => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, {
    type: 'array',
    cellStyles: true,
    cellComments: true
  });

  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const range = XLSX.utils.decode_range(sheet['!ref']);
  const parsed = [];

  for (let row = range.s.r; row <= range.e.r; row++) {
    const rowData = [];
    for (let col = range.s.c; col <= range.e.c; col++) {
      const address = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = sheet[address];

      if (cell) {
        // Главное правило: если есть комментарий - ячейка occupied
        const hasComment = Boolean(cell.c?.[0]?.t);
        let colorClass = '';
        
        if (hasComment) {
          colorClass = 'occupied';
        } else {
          // Стандартная проверка цвета
          const excelColor = cell.s?.fill?.fgColor?.rgb || '';
          const cleanColor = excelColor.startsWith('FF') 
            ? excelColor.slice(2) 
            : excelColor;

          if (['4CAF50', '66BB6A'].includes(cleanColor)) colorClass = 'occupied';
          else if (['FFD700', 'FBC02D'].includes(cleanColor)) colorClass = 'permanent';
          else if (['1E90FF', '42A5F5'].includes(cleanColor)) colorClass = 'temporary';
        }

        rowData.push({
          text: cell.v ?? '',
          color: colorClass,
          comment: cell.c?.[0]?.t || '',
          hasComment
        });
      } else {
        rowData.push({ text: '', color: '', comment: '', hasComment: false });
      }
    }
    parsed.push(rowData);
  }

  return parsed;
};