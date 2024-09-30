import axios from 'axios';

const BASE_GRAPH_URL = 'https://graph.microsoft.com/v1.0';
const SHAREPOINT_DOMAIN = process.env.NEXT_PUBLIC_SHAREPOINT_DOMAIN;
const SHAREPOINT_SITE = process.env.NEXT_PUBLIC_SHAREPOINT_SITE;
const SHAREPOINT_FILE = process.env.NEXT_PUBLIC_SHAREPOINT_FILE;
const SHAREPOINT_FOLDER = process.env.NEXT_PUBLIC_SHAREPOINT_FOLDER;

// Función para obtener el `siteId`
export const getSiteId = async (accessToken) => {
  const response = await axios.get(`${BASE_GRAPH_URL}/sites/${SHAREPOINT_DOMAIN}:/sites/${SHAREPOINT_SITE}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.id;
};

// Función para obtener el `driveId`
export const getDriveId = async (accessToken, siteId) => {
  const response = await axios.get(`${BASE_GRAPH_URL}/sites/${siteId}/drives`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.value[0].id;
};

// Función para obtener el `itemId`
export const getItemId = async (accessToken, siteId, driveId) => {
  const response = await axios.get(`${BASE_GRAPH_URL}/sites/${siteId}/drives/${driveId}/root:/${SHAREPOINT_FOLDER}/${SHAREPOINT_FILE}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.id;
};
