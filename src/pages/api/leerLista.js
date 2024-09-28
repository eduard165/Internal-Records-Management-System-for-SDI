import { leerListaDesdeExcel } from '@/services/api/excelService';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = await leerListaDesdeExcel();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error reading Excel file' });
    }
  }
}
