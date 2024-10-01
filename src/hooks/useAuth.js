import { useMsal } from '@azure/msal-react';
import { InteractionStatus, AccountInfo } from '@azure/msal-browser';
import { toast } from 'react-toastify';

export const useAuth = () => {
  const { instance, inProgress, accounts } = useMsal();

  const handleLogin = async () => {
    // Verifica si ya hay una cuenta activa
    if (accounts && accounts.length > 0) {
      toast.info('Ya has iniciado sesión.');
      return;
    }

    // Verifica si hay otra interacción en progreso
    if (inProgress !== InteractionStatus.None) {
      toast.warning('Ya hay una interacción en progreso. Espera a que termine.');
      return;
    }

    try {
      // Inicia sesión y obtiene los scopes deseados
      const loginResponse = await instance.loginPopup({
        scopes: ["User.Read", "Files.ReadWrite.All", "Calendars.ReadWrite"]
      });

      if (loginResponse) {
        toast.success('Inicio de sesión exitoso.');
      }
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      console.log(process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID);
      console.log(process.env.NEXT_PUBLIC_AZURE_AD_AUTHORITY);
        console.log(process.env.NEXT_PUBLIC_REDIRECT_URI);
      toast.error("Error al iniciar sesión. Por favor, inténtelo de nuevo.");
    }
  };

  const handleLogout = async () => {
    if (inProgress !== InteractionStatus.None) {
      toast.warning('Ya hay una interacción en progreso. Espera a que termine.');
      return;
    }

    try {
      // Cierra sesión
      await instance.logoutPopup();
      toast.success('Cierre de sesión exitoso.');
    } catch (error) {
      console.error("Error durante el cierre de sesión:", error);
      toast.error("Error al cerrar sesión. Por favor, inténtelo de nuevo.");
    }
  };

  return { handleLogin, handleLogout };
};
