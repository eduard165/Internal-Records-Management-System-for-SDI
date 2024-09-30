import { useMsal } from '@azure/msal-react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { getSiteId, getDriveId, getItemId } from '../useGraph'; // Importa las funciones de obtención de IDs

const BASE_GRAPH_URL = 'https://graph.microsoft.com/v1.0';

const useExcel = () => {
  const { instance } = useMsal();

  // Función para obtener el token de acceso
  const getAccessToken = async () => {
    const accounts = instance.getAllAccounts();
    if (accounts.length === 0) {
      throw new Error('No hay cuentas disponibles');
    }
    const response = await instance.acquireTokenSilent({
      scopes: ['Files.ReadWrite.All'],
      account: accounts[0],
    });
    return response.accessToken;
  };

  // Función para obtener los datos del archivo de Excel
  const getCarpetaFisicaName = async () => {
    try {
      const accessToken = await getAccessToken();
      const siteId = await getSiteId(accessToken);
      const driveId = await getDriveId(accessToken, siteId);
      const itemId = await getItemId(accessToken, siteId, driveId);

      const response = await axios.get(`${BASE_GRAPH_URL}/sites/${siteId}/drives/${driveId}/items/${itemId}/content`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: 'arraybuffer',  // Para obtener el archivo en formato binario
      });

      // Leer el contenido del archivo de Excel
      const data = new Uint8Array(response.data);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = 'ListaCarpetas';
      const worksheet = workbook.Sheets[sheetName];

      if (!worksheet) {
        throw new Error(`La hoja "${sheetName}" no se encontró en el archivo.`);
      }

      const carpetas = XLSX.utils.sheet_to_json(worksheet, { header: 1 }).slice(1);  // Extraer datos de la hoja
      return carpetas;
    } catch (error) {
      console.error('Error al obtener las carpetas físicas:', error);
      throw error;
    }
  };

  // Función para agregar una nueva fila en una hoja de Excel
  const submitNewRow = async (newRow, sheetName) => {
    try {
      const accessToken = await getAccessToken();
      const siteId = await getSiteId(accessToken);  // Enviar accessToken como parámetro
      const driveId = await getDriveId(accessToken, siteId);  // Enviar accessToken y siteId como parámetros
      const itemId = await getItemId(accessToken, siteId, driveId);  // Enviar accessToken, siteId y driveId como parámetros

      const response = await axios.get(`${BASE_GRAPH_URL}/sites/${siteId}/drives/${driveId}/items/${itemId}/content`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: 'arraybuffer',
      });

      const data = new Uint8Array(response.data);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[sheetName];

      // Verificar si la hoja existe
      if (!worksheet) {
        throw new Error(`La hoja "${sheetName}" no se encontró en el archivo.`);
      }

      // Leer datos existentes
      const existingData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log('Datos existentes antes de agregar la nueva fila:', existingData); // Debugging

      // Encontrar la última fila ocupada
      const lastRowIndex = existingData.length; // La longitud del array es la próxima fila vacía

      // Agregar newRow a la siguiente fila vacía
      existingData[lastRowIndex] = Object.values(newRow);

      const newWorksheet = XLSX.utils.aoa_to_sheet(existingData);
      workbook.Sheets[sheetName] = newWorksheet;

      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

      const putResponse = await axios.put(`${BASE_GRAPH_URL}/sites/${siteId}/drives/${driveId}/items/${itemId}/content`, wbout, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });

      console.log('Respuesta al guardar el archivo:', putResponse.data); // Debugging
    } catch (error) {
      console.error(`Error al agregar la nueva fila a la hoja "${sheetName}":`, error);
      throw error;
    }
  };

  // Obtener el contenido del archivo "Archivo2024"
  const getArchivo2024 = async () => {
    try {
      const accessToken = await getAccessToken();
      const siteId = await getSiteId(accessToken);  // Enviar accessToken como parámetro
      const driveId = await getDriveId(accessToken, siteId);  // Enviar accessToken y siteId como parámetros
      const itemId = await getItemId(accessToken, siteId, driveId);  // Enviar accessToken, siteId y driveId como parámetros

      const response = await axios.get(`${BASE_GRAPH_URL}/sites/${siteId}/drives/${driveId}/items/${itemId}/content`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: 'arraybuffer',
      });

      const data = new Uint8Array(response.data);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = 'Archivo2024';
      const worksheet = workbook.Sheets[sheetName];

      if (!worksheet) {
        throw new Error(`La hoja "${sheetName}" no se encontró en el archivo.`);
      }

      const carpetas = XLSX.utils.sheet_to_json(worksheet, { header: 1 }).slice(1);
      return carpetas;
    } catch (error) {
      console.error('Error al obtener el archivo "Archivo2024":', error);
      throw error;
    }
  };

  return { getCarpetaFisicaName, submitNewRow, getArchivo2024 };
};

export default useExcel;
