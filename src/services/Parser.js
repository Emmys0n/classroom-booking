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
        // Определяем цвет
        const excelColor = cell.s?.fill?.fgColor?.rgb || '';
        let colorClass = '';
        if (/4CAF50/i.test(excelColor)) colorClass = 'occupied';
        else if (/FFD700/i.test(excelColor)) colorClass = 'permanent';
        else if (/1E90FF/i.test(excelColor)) colorClass = 'temporary';

        rowData.push({
          text: cell.v ?? '',
          color: colorClass,
          comment: cell.c?.[0]?.t || ''
        });
      } else {
        rowData.push({ text: '', color: '', comment: '' });
      }
    }
    parsed.push(rowData);
  }

  return parsed;
};