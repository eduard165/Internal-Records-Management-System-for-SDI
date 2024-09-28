import React, { useEffect, useState } from 'react';
import { Label, Select } from 'flowbite-react';
import useExcel from '@/hooks/auditorias/useExcel'; // Asegúrate de que esta ruta sea correcta

const SelectCarpetaFisica = ({ formData, handleInputChange }) => {
  const [carpetas, setCarpetas] = useState([]);
  const [carpetaLabel, setCarpetaLabel] = useState('');
  const { getCarpetaFisicaName } = useExcel(); // Obtén la función del hook

  useEffect(() => {
    const cargarCarpetasFisicas = async () => {
      try {
        const carpetasData = await getCarpetaFisicaName(); // Llama a la función asíncrona
        const carpetasFormatted = carpetasData.map((row) => ({
          value: row[0], // No de carpeta (Columna A)
          label: row[1], // Nombre de carpeta (Columna B)
        }));
        setCarpetas(carpetasFormatted);
      } catch (error) {
        console.error('Error al cargar las carpetas físicas:', error);
      }
    };

    cargarCarpetasFisicas(); // Ejecuta al montar el componente
  }, [getCarpetaFisicaName]); // Asegúrate de que la función sea una dependencia

  const handleChange = (e) => {
    const { name, value } = e.target;
    handleInputChange(e);

    const selectedCarpeta = carpetas.find(opcion => opcion.value === value);
    setCarpetaLabel(selectedCarpeta ? selectedCarpeta.label : '');
  };

  return (
    <div>
      <Label htmlFor="noCarpetaFisica" value="No. Carpeta Física" />
      <Select
        id="noCarpetaFisica"
        name="noCarpetaFisica"
        value={formData.noCarpetaFisica}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione una carpeta</option>
        {carpetas.map((carpeta) => (
          <option key={carpeta.value} value={carpeta.value}>
            {carpeta.value} - {carpeta.label} {/* Muestra número y nombre */}
          </option>
        ))}
      </Select>
      {carpetaLabel && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-sm text-gray-700">
          {carpetaLabel}
        </div>
      )}
    </div>
  );
};

export default SelectCarpetaFisica;
