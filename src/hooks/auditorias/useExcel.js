import { useMsal } from '@azure/msal-react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const BASE_GRAPH_URL = 'https://graph.microsoft.com/v1.0';

const useExcel = () => {
  const { instance } = useMsal();

  const siteId = ''; // Fija el siteId
  const driveId = ''; // Fija el driveId
  const itemId = ''; // Fija el itemId
  
  
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

  const getCarpetaFisicaName = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.get(`${BASE_GRAPH_URL}/sites/${siteId}/drives/${driveId}/items/${itemId}/content`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: 'arraybuffer',
      });
  
      const data = new Uint8Array(response.data);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = 'ListaCarpetas';
      const worksheet = workbook.Sheets[sheetName];
  
      if (!worksheet) {
        throw new Error(`La hoja "${sheetName}" no se encontró en el archivo.`);
      }
  
      const carpetas = XLSX.utils.sheet_to_json(worksheet, { header: 1 }).slice(1);
      return carpetas;
    } catch (error) {
      console.error('Error al obtener las carpetas físicas:', error);
      throw error;
    }
  };
  const submitNewRow = async (newRow, sheetName) => {
    try {
      const accessToken = await getAccessToken();
  
      const response = await axios.get(`${BASE_GRAPH_URL}/sites/${siteId}/drives/${driveId}/items/${itemId}/content`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: 'arraybuffer',
      });
  
      const data = new Uint8Array(response.data);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[sheetName];

      if (!worksheet) {
        throw new Error(`La hoja "${sheetName}" no se encontró en el archivo.`);
      }

      const existingData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log('Datos existentes antes de agregar la nueva fila:', existingData);
      const lastRowIndex = existingData.length; 
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
  
  const getArchivo2024 = async () => {
      try {
        const accessToken = await getAccessToken();
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
        console.error('Error al obtener las carpetas físicas:', error);
        throw error;
      }
    };
  

  return { getCarpetaFisicaName, submitNewRow, getArchivo2024 };
};

export default useExcel;
