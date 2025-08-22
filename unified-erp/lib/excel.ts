import ExcelJS from 'exceljs';

export async function buildExcel({
  sheetName,
  headers,
  rows
}: {
  sheetName: string;
  headers: string[];
  rows: (string | number | Date)[][];
}): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(sheetName);
  ws.addRow(headers);
  rows.forEach((r) => ws.addRow(r));
  const buf = await wb.xlsx.writeBuffer();
  return Buffer.from(buf);
}