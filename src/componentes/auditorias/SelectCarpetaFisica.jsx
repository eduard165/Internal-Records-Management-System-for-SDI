import React, { useEffect, useState } from 'react';
import { Label, Select } from 'flowbite-react';
import useExcel from '@/hooks/auditorias/useExcel'; // Asegúrate de que esta ruta sea correcta

const SelectCarpetaFisica = ({ formData, handleInputChange }) => {
  const [carpetas, setCarpetas] = useState([]);
  const { getCarpetaFisicaName } = useExcel(); // Obtén la función del hook

  useEffect(() => {
    const cargarCarpetasFisicas = async () => {
      try {
        // Llama a la función para obtener los datos de carpetas
        const carpetasData = await getCarpetaFisicaName(); 
        const carpetasFormatted = carpetasData.map((row) => ({
          value: `${row[0]}_${row[1]}`, // Combina el No. de Carpeta y el Label en un solo valor
          label: `${row[0]} - ${row[1]}`, // Muestra No. de Carpeta y Label en el dropdown
        }));
        setCarpetas(carpetasFormatted);
      } catch (error) {
        console.error('Error al cargar las carpetas físicas:', error);
      }
    };

    cargarCarpetasFisicas(); // Ejecuta al montar el componente
  }, [getCarpetaFisicaName]); // Asegúrate de que la función sea una dependencia

  return (
    <div>
      <Label htmlFor="noCarpetaFisica" value="No. Carpeta Física" />
      <Select
        id="noCarpetaFisica"
        name="noCarpetaFisica"
        value={formData.noCarpetaFisica}
        onChange={handleInputChange}
        required
      >
        <option value="">Seleccione una carpeta</option>
        {carpetas.map((carpeta) => (
          <option key={carpeta.value} value={carpeta.value}>
            {carpeta.label}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default SelectCarpetaFisica;
