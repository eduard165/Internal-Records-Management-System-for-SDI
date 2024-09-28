// src/componentes/Bienvenida.js
import React from 'react';
import ButtonAuth from './ButtonAuth';

const HeroSection = ({ isAuthenticated, onAuthChange }) => {
  return (
    <div className="relative bg-gray-900 h-screen">
      <img
        src="/EdificioA.jpg?height=1080&width=1920"
        alt="Edificio A de la Universidad Veracruzana"
        className="w-full h-full object-cover opacity-50"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-white text-center">
          Bienvenido al archivo interno de la SDI
        </h1>
        <ButtonAuth
          isAuthenticated={isAuthenticated}
          onAuthChange={onAuthChange}
        />
      </div>
    </div>
  );
};

export default HeroSection;
