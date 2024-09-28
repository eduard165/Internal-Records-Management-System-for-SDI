//src/app/page.js
"use client";

import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import HeroSection from '@/componentes/heroSeccion/Bienvenida'; // Asegúrate de que la ruta es correcta
import NavbarComponent from '@/componentes/Navbar'; // Asegúrate de que la ruta es correcta

const Page = () => {
  const { instance } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Estado inicial como null para manejar el estado de carga

  // Función para verificar el estado de autenticación
  const checkAuthStatus = () => {
    const accounts = instance.getAllAccounts();
    setIsAuthenticated(accounts.length > 0); // Actualiza el estado si hay cuentas activas
  };

  useEffect(() => {
    checkAuthStatus(); // Verifica el estado de autenticación cuando el componente se monta
  }, [instance]);

  // Función para manejar cambios en el estado de autenticación, como el logout
  const handleAuthChange = () => {
    checkAuthStatus(); // Verifica nuevamente si hay cuentas activas después de logout o login
  };

  // Mostrar un estado de carga mientras se verifica el estado de autenticación
  if (isAuthenticated === null) {
    return <div>Cargando...</div>; // Muestra un indicador de carga
  }

  return (
    <div>
      {/* Solo renderizar NavbarComponent y HeroSection si se conoce el estado de autenticación */}
      <NavbarComponent isAuthenticated={isAuthenticated} onLogout={handleAuthChange} />
      <HeroSection isAuthenticated={isAuthenticated} onAuthChange={handleAuthChange} />
    </div>
  );
};

export default Page;