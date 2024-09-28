import { useMsal } from '@azure/msal-react';
import { toast } from 'react-toastify';

export const useAuth = () => {
  const { instance } = useMsal();

  const handleLogin = async () => {
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
      toast.error("Error al iniciar sesión. Por favor, inténtelo de nuevo.");
    }
  };

  const handleLogout = async () => {
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
