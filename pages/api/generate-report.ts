import { NextApiRequest, NextApiResponse } from 'next';
import {
  generatePdfReport,
  generateCsvReport,
  generateExcelReport,
  ReportData
} from '@/lib/reportService';

interface ReportRequest {
  type: 'pdf' | 'csv' | 'excel';
  data: ReportData;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { type, data } = req.body as ReportRequest;

    if (!type || !data) {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    let reportBuffer;
    switch (type) {
      case 'pdf':
        reportBuffer = await generatePdfReport(data);
        break;
      case 'csv':
        reportBuffer = await generateCsvReport(data);
        break;
      case 'excel':
        reportBuffer = await generateExcelReport(data);
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=report.${type}`);
    return res.send(reportBuffer);
  } catch (error) {
    console.error('Report generation error:', error);
    return res.status(500).json({ message: 'Failed to generate report' });
  }
}
