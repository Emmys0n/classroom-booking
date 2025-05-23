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
        const text = cell.v ?? '';
        const comment = cell.c?.[0]?.t || '';
        const hasComment = Boolean(comment);

        // Получаем цвет ячейки
        const excelColor = cell.s?.fill?.fgColor?.rgb || '';
        const cleanColor = excelColor.startsWith('FF') ? excelColor.slice(2) : excelColor;

        let colorClass = '';

        // Регулярки
        const isTextLike = typeof text === 'string' && /[a-zA-Zа-яА-Я]/.test(text);
        const isTimeFormat = /^\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}$/.test(text);
        const isJustDigits = /^\d+$/.test(text);
        const isRoomCode = /^\d+[ПпAaАа]?$/.test(text);
        const excludedWords = [
          'дни недели', 'часы звонков',
          'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота',
          'физ', 'англ', '(до)', 'к', 'x'
        ];
        
        const isExcludedWord = excludedWords.includes(String(text).trim().toLowerCase());

        if (hasComment) {
          colorClass = 'occupied';
        } else if (
          isTextLike &&
          !isTimeFormat &&
          !isJustDigits &&
          !isRoomCode &&
          !isExcludedWord
        ) {
          colorClass = 'permanent';
        } else {
          if (['4CAF50', '66BB6A'].includes(cleanColor)) colorClass = 'occupied';
          else if (['FFD700', 'FBC02D'].includes(cleanColor)) colorClass = 'permanent';
          else if (['1E90FF', '42A5F5'].includes(cleanColor)) colorClass = 'temporary';
        }

        rowData.push({
          text,
          color: colorClass,
          comment,
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
