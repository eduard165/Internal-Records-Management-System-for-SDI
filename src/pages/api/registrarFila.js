import { agregarFilaExcel } from '@/services/api/excelService';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { data } = req.body;

    try {
      await agregarFilaExcel(data);
      res.status(200).json({ message: 'Row added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error adding row to Excel file' });
    }
  }
}
