// authConfig.js
import { PublicClientApplication } from '@azure/msal-browser';

export const msalConfig = {
  auth: {
    clientId: "Por seguridad ",
    authority: "Seguridad",
    redirectUri: "http://localhost:3000",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
  scopes: ["User.Read", "Files.ReadWrite.All", "Calendars.ReadWrite"],
};

const msalInstance = new PublicClientApplication(msalConfig);

export default msalInstance;
