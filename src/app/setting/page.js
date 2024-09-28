'use client'

import React, { useState } from 'react';
import { Card, Button, Label, TextInput, Toggle, Select, Tabs, Avatar } from 'flowbite-react';
import { User, Bell, Lock, Palette, ChevronRight } from 'lucide-react';

const colors = {
  greenDark: '#0b772d',
  blueDark: '#04539c',
  grayLight: '#cad3d7',
  grayDark: '#5d6674',
  greenLight: '#55b66d',
  blueMedium: '#5d90b4',
  blueBright: '#2162a8',
  blueLight: '#799dcc',
};

export default function ConfiguracionesPage() {
  const [activeTab, setActiveTab] = useState(0);

  const tabItems = [
    { title: "Perfil", icon: User },
    { title: "Notificaciones", icon: Bell },
    { title: "Seguridad", icon: Lock },
    { title: "Tema", icon: Palette }
  ];

  return (
    <div className="min-h-screen bg-cover bg-center py-8 px-4 sm:px-6 lg:px-8" style={{backgroundImage: "url('/placeholder.svg?height=1080&width=1920')"}}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">Configuraciones de Usuario</h1>
        
        <div className="bg-white bg-opacity-90 shadow-lg rounded-lg overflow-hidden backdrop-blur-sm">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gray-100 bg-opacity-75 p-4">
              <div className="flex flex-col items-center mb-6">
                <Avatar size="xl" img="/placeholder.svg?height=128&width=128" rounded />
                <h2 className="mt-4 text-xl font-semibold text-gray-800">Juan Pérez</h2>
                <p className="text-sm text-gray-600">juan.perez@example.com</p>
              </div>
              <nav>
                {tabItems.map((item, index) => (
                  <button
                    key={index}
                    className={`flex items-center w-full text-left px-4 py-2 my-1 rounded-md transition-colors ${
                      activeTab === index
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveTab(index)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.title}
                    <ChevronRight className="ml-auto h-5 w-5" />
                  </button>
                ))}
              </nav>
            </div>
            <div className="md:w-2/3 p-6">
              {activeTab === 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Información del Perfil</h3>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="nombre" value="Nombre" />
                      <TextInput id="nombre" placeholder="Tu nombre" required />
                    </div>
                    <div>
                      <Label htmlFor="email" value="Email" />
                      <TextInput id="email" type="email" placeholder="tu@email.com" required />
                    </div>
                    <div>
                      <Label htmlFor="departamento" value="Departamento" />
                      <Select id="departamento" required>
                        <option>Selecciona un departamento</option>
                        <option>Recursos Humanos</option>
                        <option>Tecnología</option>
                        <option>Finanzas</option>
                        <option>Marketing</option>
                      </Select>
                    </div>
                    <Button color="blue">Guardar Cambios</Button>
                  </form>
                </div>
              )}
              {activeTab === 1 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Preferencias de Notificaciones</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Notificaciones por email</span>
                      <Toggle />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Notificaciones push</span>
                      <Toggle />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Resumen semanal</span>
                      <Toggle />
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 2 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Configuración de Seguridad</h3>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="password" value="Nueva Contraseña" />
                      <TextInput id="password" type="password" required />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" value="Confirmar Nueva Contraseña" />
                      <TextInput id="confirmPassword" type="password" required />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Toggle id="2fa" />
                      <Label htmlFor="2fa">Habilitar autenticación de dos factores</Label>
                    </div>
                    <Button color="blue">Actualizar Seguridad</Button>
                  </form>
                </div>
              )}
              {activeTab === 3 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Preferencias de Tema</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="tema" value="Seleccionar Tema" />
                      <Select id="tema" required>
                        <option>Claro</option>
                        <option>Oscuro</option>
                        <option>Sistema</option>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Toggle id="highContrast" />
                      <Label htmlFor="highContrast">Modo de alto contraste</Label>
                    </div>
                    <Button color="blue">Aplicar Cambios</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}