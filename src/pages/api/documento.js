import formidable from 'formidable'; // Para manejar archivos
import { agregarFilaExcel } from '../../services/api/excelService';
import { uploadFileToSharePoint } from '../../services/api/sharepointService';

export const config = {
  api: {
    bodyParser: false, // Necesario para manejar el form-data con formidable
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();
  
  // Manejar el form-data, incluyendo los archivos
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error al procesar el formulario:', err);
      return res.status(500).json({ error: 'Error al procesar el formulario' });
    }

    try {
      // 1. Agregar la fila a Excel con los campos de "fields"
      await agregarFilaExcel(fields);

      // 2. Subir archivo a SharePoint si se proporcionó
      if (files.archivo) {
        const folderPath = fields.noCarpetaFisica; // La carpeta que el usuario seleccionó
        await uploadFileToSharePoint(folderPath, files.archivo);
      }

      return res.status(200).json({ message: 'Formulario procesado con éxito' });
    } catch (error) {
      console.error('Error al procesar el formulario:', error);
      return res.status(500).json({ error: 'Error al procesar el formulario' });
    }
  });
}
