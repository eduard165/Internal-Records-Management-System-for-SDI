import { PublicClientApplication } from '@azure/msal-browser';

export const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID,
    authority: process.env.NEXT_PUBLIC_AZURE_AD_AUTHORITY,  // Configura la autoridad desde el entorno
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000',  // Local en desarrollo, variable en producción
  },
  cache: {
    cacheLocation: "localStorage",  // Mantener el estado de la sesión en localStorage
    storeAuthStateInCookie: false,  // True si tienes problemas con cookies en navegadores antiguos
  },
  scopes: ["User.Read", "Files.ReadWrite.All", "Calendars.ReadWrite"],  // Scopes necesarios
};

const msalInstance = new PublicClientApplication(msalConfig);

export default msalInstance;
