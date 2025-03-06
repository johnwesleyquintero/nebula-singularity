import { ReportType } from '../components/reports/report-generator';
import { Buffer } from 'buffer';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { stringify } from 'csv-stringify';
import ExcelJS from 'exceljs';

// Export report generation functions and interface
export interface ReportData {
  startDate: string;
  endDate: string;
  filters: {
    department?: string;
    status?: string;
  };
  includeCharts: boolean;
}

export const generatePdfReport = async (reportData: ReportData): Promise<Buffer> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText('Nebula Report', {
    x: 50,
    y: height - 50,
    size: 30,
    font,
    color: rgb(0, 0, 0)
  });

  return Buffer.from(await pdfDoc.save());
};

export const generateCsvReport = async (reportData: ReportData): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    stringify([Object.values(reportData)], (err, output) => {
      if (err) return reject(err);
      resolve(Buffer.from(output));
    });
  });
};

export const generateExcelReport = async (reportData: ReportData): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Report');

  worksheet.addRow(Object.keys(reportData));
  worksheet.addRow(Object.values(reportData).map(value => {
    if (typeof value === 'number') return value;
    return value?.toString() || '';
  }));

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
};

export const generateReport = async (
  type: ReportType,
  data: ReportData
): Promise<Buffer> => {
  switch (type) {
    case 'pdf':
      return generatePdfReport(data);
    case 'csv':
      return generateCsvReport(data);
    case 'xlsx':
      return generateExcelReport(data);
    default:
      throw new Error('Invalid report type');
  }
};
