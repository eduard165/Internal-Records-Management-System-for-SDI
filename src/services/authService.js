import { msalInstance } from './authConfig';

export const getAccessToken = async () => {
  try {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) {
      await msalInstance.loginRedirect({
        scopes: ['User.Read', 'Files.ReadWrite.All', 'Sites.ReadWrite.All']

      });
      throw new Error('No hay cuentas activas. Redirigiendo al inicio de sesión.');
    }

    const accessTokenResponse = await msalInstance.acquireTokenSilent({
      scopes: ['Files.ReadWrite.All', 'Sites.ReadWrite.All', 'User.Read'],
      account: accounts[0],
    });

    console.log(accessTokenResponse);
    return accessTokenResponse.accessToken;
  } catch (error) {
    console.error('Error obteniendo el token de acceso:', error);
    throw error;
  }
};
