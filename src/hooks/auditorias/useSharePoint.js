import { useMsal } from '@azure/msal-react';
import axios from 'axios';
import { getSiteId, getDriveId } from '../useGraph'; // Importa las funciones desde el archivo separado

const BASE_GRAPH_URL = 'https://graph.microsoft.com/v1.0';

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
  const ensureFolderExists = async (accessToken, siteId, driveId, baseFolder, folderName) => {
    try {
      // Codificar los segmentos de la ruta para evitar errores
      const encodedBaseFolder = encodeURIComponent(baseFolder);
      const encodedFolderName = encodeURIComponent(folderName);

      const folderPath = `${encodedBaseFolder}/${encodedFolderName}`;
      const folderCheckUrl = `${BASE_GRAPH_URL}/sites/${siteId}/drives/${driveId}/root:/${folderPath}`;

      try {
        // Intentar obtener la carpeta
        await axios.get(folderCheckUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(`La carpeta ${folderPath} ya existe.`);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(`La carpeta ${folderPath} no existe. Creando...`);
          const folderCreateUrl = `${BASE_GRAPH_URL}/sites/${siteId}/drives/${driveId}/root:/${folderPath}:/children`;

          // Crear la carpeta
          await axios.post(
            folderCreateUrl,
            {
              name: folderName, // No codificar el nombre al crear la carpeta
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
      console.error(`Error al verificar o crear la carpeta ${folderName}:`, error);
      throw error;
    }
  };

  // Función para crear la estructura de carpetas
  // OJOOOOOOOO, HAY UN PROBLEMA CUANDO EN LA LISTA DE LAS CARPETAS SE PONE ESTE CARACTER :, NO DEBE HABER ESE CARACTER AL MOMENTO DE MANDAR EL NOMBRE DE LA CARPETA FISICA
  const createFolderStructure = async (noCarpetaFisica, carpetaLabel, auditoria, year, monthIndex) => {
    const baseFolder = 'SDIDocumentos';
    const carpetaFisica = `${noCarpetaFisica}_${carpetaLabel}`;
    const yearFolder = `${year}`;
    const monthFolder = getMonthName(monthIndex);
    const accessToken = await getAccessToken();
    const siteId = await getSiteId(accessToken);  // Obtener siteId dinámicamente
    const driveId = await getDriveId(accessToken, siteId);  // Obtener driveId dinámicamente
    // Verificar y crear cada nivel de carpeta

    const encodedCarpetaFisica = encodeURIComponent(carpetaFisica);
    const encodedAditoria = encodeURIComponent(auditoria)

    await ensureFolderExists(accessToken, siteId, driveId, baseFolder, carpetaFisica); // Crear la carpeta física
    await ensureFolderExists(accessToken, siteId, driveId, `${baseFolder}/${encodedCarpetaFisica}`, encodedAditoria); // Crear la carpeta de auditoría
    await ensureFolderExists(accessToken, siteId, driveId, `${baseFolder}/${encodedCarpetaFisica}/${encodedAditoria}`, yearFolder); // Crear la carpeta del año
    await ensureFolderExists(accessToken, siteId, driveId, `${baseFolder}/${encodedCarpetaFisica}/${encodedAditoria}/${yearFolder}`, monthFolder); // Crear la carpeta del mes
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

      // Crear la estructura de carpetas si no existe
      await createFolderStructure(noCarpetaFisica, carpetaLabel, auditoria, year, monthIndex);

      const siteId = await getSiteId(accessToken);  // Obtener siteId dinámicamente
      const driveId = await getDriveId(accessToken, siteId);  // Obtener driveId dinámicamente

      // Ruta final para subir el archivo
      const folderPath = `SDIDocumentos/${noCarpetaFisica}_${carpetaLabel}/${auditoria}/${year}/${getMonthName(monthIndex)}`;

      // Subir el archivo a la ruta en SharePoint
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

  // Función para recuperar archivos de una carpeta
  const listFilesInFolder = async (noCarpetaFisica, carpetaLabel, auditoria, year, monthIndex) => {
    try {
      const accessToken = await getAccessToken();
      const siteId = await getSiteId(accessToken);  // Obtener siteId dinámicamente
      const driveId = await getDriveId(accessToken, siteId);  // Obtener driveId dinámicamente

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
