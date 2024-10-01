//src/componentes/ButtonAuth.js
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

const ButtonAuth = ({ isAuthenticated, onAuthChange }) => {
  const { handleLogin, handleLogout } = useAuth();

  const handleAuth = async () => {
    if (isAuthenticated) {
      onAuthChange(false); // Cambia el estado de autenticación a falso
    } else {
      await handleLogin();
      onAuthChange(true); // Cambia el estado de autenticación a verdadero
    }
  };
  return (
    !isAuthenticated && (
      <button
        id="auth-button"
        onClick={handleAuth}
        className="px-4 py-2 bg-blue-500 text-white rounded mt-4 mx-auto"
      >
        Iniciar Sesión
      </button>
    )
  );
};

export default ButtonAuth;
