"use client";

import React, { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { useRouter } from 'next/navigation'; // Usar router para redirección
import DocumentoForm from '../../componentes/auditorias/AudioriasForm'; // Ruta correcta del formulario
import NavbarComponent from '@/componentes/Navbar'; // Asegúrate de que la ruta sea correcta

const FormPage = () => {
  const { instance } = useMsal(); // Obtener la instancia de MSAL
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Cambia a 'null' para manejar estado de carga
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = () => {
      const accounts = instance.getAllAccounts();
      setIsAuthenticated(accounts.length > 0); // Verifica si hay cuentas activas
    };

    checkAuthentication(); // Llama a la función de verificación al montar el componente
  }, [instance]);

  // Redirección solo después de verificar la autenticación
  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/'); // Redirigir a la página principal si no está autenticado
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated === null) {
    return <div>Cargando...</div>; // Mostrar estado de carga mientras se verifica la autenticación
  }

  return (
    <div>
      <NavbarComponent
        isAuthenticated={isAuthenticated}
        instance={instance}
        onLogout={() => setIsAuthenticated(false)}
      />      
      <DocumentoForm /> {/* Aquí se carga el componente del formulario */}
    </div>
  );
};

export default FormPage;
