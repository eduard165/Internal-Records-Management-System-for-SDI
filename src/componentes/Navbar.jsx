import React from 'react';
import { Navbar, Dropdown, Button } from 'flowbite-react';
import { ChevronDown, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth'; // Hook personalizado de autenticación
import Link from 'next/link';

const NavbarComponent = ({ isAuthenticated, onLogout }) => {
  const { handleLogout } = useAuth(); // Si useAuth necesita la instancia

  const handleLogoutAndUpdateState = async () => {
    await handleLogout(); // Espera a que se complete el logout
    onLogout(); // Llama a la función del componente principal para reverificar la autenticación
  };

  return isAuthenticated ? (
    <Navbar fluid fixed={true.toString()} className="bg-white shadow-md">
      <div className="flex items-center">
        <Link href="/" passHref>
          <img
            src="/logo1.png?height=40&width=40"
            className="mr-3 h-10"
            alt="UV Logo"
          />
        </Link>
        <Link href="/" passHref>
          <span className="self-center whitespace-nowrap text-xl font-semibold text-blue-700">
            Secretaría de Desarrollo Institucional
          </span>
        </Link>
      </div>
      <div className="flex md:order-2">
        <Button
          color="light"
          onClick={handleLogoutAndUpdateState} // Actualiza el estado solo tras confirmar el logout
          className="transition-all duration-300 ease-in-out"
        >
          <User className="mr-2 h-5 w-5" />
          Cerrar Sesión
        </Button>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <span className="flex items-center text-black">
              Registrar
              <ChevronDown className="ml-2 h-4 w-4" />
            </span>
          }
        >
          <Dropdown.Item>
            <Link href="/FormAuditorias">Auditoría</Link>
          </Dropdown.Item>
          <Dropdown.Item>
            <Link href="/Proximamente">Otro Formulario</Link>
          </Dropdown.Item>
        </Dropdown>
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <span className="flex items-center text-black">
              Consultar
              <ChevronDown className="ml-2 h-4 w-4" />
            </span>
          }
        >
          <Dropdown.Item>
            <Link href="/AudiMana">Auditorías</Link>
          </Dropdown.Item>
          <Dropdown.Item>
            <Link href="/Proximamente">Minutario Interno</Link>
          </Dropdown.Item>
        </Dropdown>
      </Navbar.Collapse>
    </Navbar>
  ) : null; // Solo renderiza si está autenticado
};

export default NavbarComponent;
