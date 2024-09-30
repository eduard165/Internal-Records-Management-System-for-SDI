import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUploader = ({ onFileUpload, clearFileName }) => {
  const [fileName, setFileName] = useState(''); // Estado para almacenar el nombre del archivo

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFileName(file.name); // Guarda el nombre del archivo
      onFileUpload(file); // Pasamos el archivo subido al componente padre
    }
    if (rejectedFiles.length > 0) {
      alert('Tipo de archivo no aceptado. Por favor, sube un archivo PDF o Word.');
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    }
  });

  // Limpiar el nombre del archivo si se llama a `clearFileName`
  useEffect(() => {
    if (clearFileName) {
      setFileName(''); // Limpia el nombre del archivo
    }
  }, [clearFileName]);

  return (
    <div>
      <div
        {...getRootProps()}
        className="p-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
      >
        <input {...getInputProps()} />
        <p className="text-center text-gray-600">Arrastra y suelta un archivo aquí, o haz clic para seleccionarlo</p>
      </div>
      {fileName && ( // Muestra el nombre del archivo si hay uno
        <div className="mt-2 text-center text-gray-700">
          <strong>Archivo cargado:</strong> {fileName}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
