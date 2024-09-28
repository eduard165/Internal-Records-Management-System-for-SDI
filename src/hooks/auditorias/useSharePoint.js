import { useMsal } from '@azure/msal-react';
import axios from 'axios';

const BASE_GRAPH_URL = 'https://graph.microsoft.com/v1.0';

// Valores fijos
const siteId = '';
const driveId = '';

const useSharePoint = () => {
  const { instance } = useMsal();

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

  // Función para obtener el nombre del mes
  const getMonthName = (monthIndex) => {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return monthNames[monthIndex];
  };

  // Función para verificar y crear cada nivel de carpetas en "Auditorias/SDIDocumentos"
  const ensureFolderExists = async (folderPath) => {
    try {
      const accessToken = await getAccessToken();

      // Verificar si la carpeta ya existe
      const folderCheckUrl = `${BASE_GRAPH_URL}/sites/${siteId}/drives/${driveId}/root:/Auditorias/${folderPath}`;

      try {
        // Intentamos obtener la carpeta para ver si ya existe
        await axios.get(folderCheckUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(`La carpeta ${folderPath} ya existe.`);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(`La carpeta ${folderPath} no existe. Creando...`);

          const folderCreateUrl = `${BASE_GRAPH_URL}/sites/${siteId}/drives/${driveId}/root:/Auditorias/${folderPath}:/children`;

          // Creamos la carpeta con el cuerpo que mencionaste
          await axios.post(
            folderCreateUrl,
            {
              name: folderPath.split('/').pop(),
              folder: {},
              '@microsoft.graph.conflictBehavior': 'replace',
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            }
          );
          console.log(`Carpeta ${folderPath} creada con éxito.`);
        } else {
          console.error(`Error al verificar la carpeta ${folderPath}:`, error);
          throw error;
        }
      }
    } catch (error) {
      console.error(`Error al verificar o crear la carpeta ${folderPath}:`, error);
      throw error;
    }
  };

  // Función para crear la estructura de carpetas
  const createFolderStructure = async (noCarpetaFisica, carpetaLabel, auditoria, year, monthIndex) => {
    const baseFolder = 'SDIDocumentos';
    const carpetaFisica = `${noCarpetaFisica}_${carpetaLabel}`; // No concatenar la auditoría aquí
    const yearFolder = `${year}`;
    const monthFolder = getMonthName(monthIndex);

    // Verificar y crear cada nivel de carpeta
    await ensureFolderExists(`${baseFolder}/${carpetaFisica}`); // Crear la carpeta física
    await ensureFolderExists(`${baseFolder}/${carpetaFisica}/${auditoria}`); // Crear la carpeta de auditoría
    await ensureFolderExists(`${baseFolder}/${carpetaFisica}/${auditoria}/${yearFolder}`); // Crear la carpeta del año
    await ensureFolderExists(`${baseFolder}/${carpetaFisica}/${auditoria}/${yearFolder}/${monthFolder}`); // Crear la carpeta del mes
  };

  // Función para subir un archivo
  const uploadFileToSharePoint = async (noCarpetaFisica, carpetaLabel, auditoria, file, fechaArchivo) => {
    if (!file || !file.name) {
      throw new Error('Archivo no definido o no válido');
    }

    try {
      const accessToken = await getAccessToken();
      const fileName = encodeURIComponent(file.name);

      const year = fechaArchivo.getFullYear();  // Año extraído del formulario
      const monthIndex = fechaArchivo.getMonth();  // Mes extraído del formulario

      // Crear la estructura de carpetas
      await createFolderStructure(noCarpetaFisica, carpetaLabel, auditoria, year, monthIndex);

      // Ruta final para subir el archivo
      const folderPath = `SDIDocumentos/${noCarpetaFisica}_${carpetaLabel}/${auditoria}/${year}/${getMonthName(monthIndex)}`;

      // Subir el archivo
      const uploadUrl = `${BASE_GRAPH_URL}/sites/${siteId}/drives/${driveId}/root:/Auditorias/${folderPath}/${fileName}:/content`;

      const response = await axios.put(uploadUrl, file, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': file.type,
        },
      });

      console.log('Archivo subido con éxito a SharePoint:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al subir el archivo a SharePoint:', error);
      throw error;
    }
  };

  // Función para recuperar un archivo de una carpeta
  const listFilesInFolder = async (noCarpetaFisica, carpetaLabel, auditoria, year, monthIndex) => {
    try {
      const accessToken = await getAccessToken();

      const folderPath = `SDIDocumentos/${noCarpetaFisica}_${carpetaLabel}/${auditoria}/${year}/${getMonthName(monthIndex)}`;
      const listUrl = `${BASE_GRAPH_URL}/sites/${siteId}/drives/${driveId}/root:/Auditorias/${folderPath}:/children`;

      const response = await axios.get(listUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Archivos en la carpeta:', response.data.value);
      return response.data.value;
    } catch (error) {
      console.error('Error al listar archivos en la carpeta:', error);
      throw error;
    }
  };

  return { uploadFileToSharePoint, listFilesInFolder };
};

export default useSharePoint;
