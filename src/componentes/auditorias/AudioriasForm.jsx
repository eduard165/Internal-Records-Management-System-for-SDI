import React, { useState } from 'react';
import { Button, Label, Textarea, Select } from 'flowbite-react';
import FileUploader from './FileUploader';
import SelectCarpetaFisica from './SelectCarpetaFisica';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import useExcel from '@/hooks/auditorias/useExcel';
import useSharePoint from '@/hooks/auditorias/useSharePoint';

const DocumentoForm = () => {
  const { submitNewRow } = useExcel();
  const { uploadFileToSharePoint } = useSharePoint();

  const [formData, setFormData] = useState({
    noOficio: '',
    seguimientoOficio: '',
    noCarpetaFisica: '',
    auditoria: '',
    emitidoPor: '',
    fechaOficio: new Date(),
    descripcion: '',
    fechaArchivo: new Date(),
    capturadoPor: '',
    estado: '',
    comentario: '',
    archivo: null,
    respaldo: 'pendiente',
  });

  const [clearFileName, setClearFileName] = useState(false); // Estado para limpiar el archivo

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loadingToastId = toast.loading('Cargando...');

    const newRow = [
      formData.respaldo,
      formData.noOficio,
      formData.seguimientoOficio,
      formData.noCarpetaFisica,
      formData.carpetaLabel,
      formData.auditoria,
      formData.emitidoPor,
      formData.fechaOficio,
      formData.descripcion,
      formData.fechaArchivo,
      formData.capturadoPor,
      formData.estado || 'pendiente',
      formData.comentario,
      '',
    ];

    try {
      let fileUrl = '';

      if (formData.archivo && formData.archivo.name) {
        const [noCarpetaFisica, carpetaLabel] = formData.noCarpetaFisica.split('_');
        const auditoria = formData.auditoria;
        const fechaArchivo = formData.fechaArchivo;
        const file = formData.archivo;

        const response = await uploadFileToSharePoint(noCarpetaFisica, carpetaLabel, auditoria, file, fechaArchivo);
        fileUrl = response.webUrl;
        newRow[newRow.length - 1] = fileUrl;
      }

      await submitNewRow(newRow, 'Archivo2024');

      toast.update(loadingToastId, {
        render: 'Documento guardado y archivo subido exitosamente!',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });

      // Resetea los campos del formulario
      setFormData({
        noOficio: '',
        seguimientoOficio: '',
        noCarpetaFisica: '',
        auditoria: '',
        emitidoPor: '',
        fechaOficio: new Date(),
        descripcion: '',
        fechaArchivo: new Date(),
        capturadoPor: '',
        estado: '',
        comentario: '',
        archivo: null,
        respaldo: 'pendiente',
      });

      // Limpia el nombre del archivo
      setClearFileName(true); // Activa la limpieza del nombre del archivo

    } catch (error) {
      console.error('Error al guardar el documento:', error);
      toast.update(loadingToastId, {
        render: 'Error al guardar el documento.',
        type: 'error',
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundImage: "url('/EdificioA.jpg')", backgroundSize: 'cover' }}>
      <div className="max-w-4xl mx-auto bg-white bg-opacity-90 p-6 rounded-lg shadow-lg backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Formulario de Auditoría</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label value="Respaldo" />
              <Select
                name="respaldo"
                value={formData.respaldo}
                disabled
              >
                <option value="pendiente">Pendiente</option>
                <option value="respaldado">Respaldado</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="noOficio" value="No. de Oficio" />
              <input
                type="text"
                id="noOficio"
                name="noOficio"
                value={formData.noOficio}
                onChange={handleInputChange}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                required
              />
            </div>
            <div>
              <Label htmlFor="seguimientoOficio" value="Seguimiento a oficio" />
              <input
                type="text"
                id="seguimientoOficio"
                name="seguimientoOficio"
                value={formData.seguimientoOficio}
                onChange={handleInputChange}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
              />
            </div>

            <SelectCarpetaFisica formData={formData} handleInputChange={handleInputChange} />

            <div>
              <Label htmlFor="auditoria" value="Auditoría" />
              <input
                type="text"
                id="auditoria"
                name="auditoria"
                value={formData.auditoria}
                onChange={handleInputChange}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
              />
            </div>
            <div>
              <Label htmlFor="emitidoPor" value="Emitido por" />
              <input
                type="text"
                id="emitidoPor"
                name="emitidoPor"
                value={formData.emitidoPor}
                onChange={handleInputChange}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                required
              />
            </div>
            <div>
              <Label htmlFor="fechaOficio" value="Fecha de oficio" />
              <DatePicker
                selected={formData.fechaOficio}
                onChange={(date) => handleInputChange({ target: { name: 'fechaOficio', value: date } })}
                locale="es"
                dateFormat="dd/MM/yyyy"
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="descripcion" value="Descripción" />
              <Textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                required
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="fechaArchivo" value="Fecha de archivo" />
              <DatePicker
                selected={formData.fechaArchivo}
                onChange={(date) => handleInputChange({ target: { name: 'fechaArchivo', value: date } })}
                locale="es"
                dateFormat="dd/MM/yyyy"
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="capturadoPor" value="Capturado por" />
              <input
                type="text"
                id="capturadoPor"
                name="capturadoPor"
                value={formData.capturadoPor}
                onChange={handleInputChange}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                required
              />
            </div>
            <div>
              <Label htmlFor="estado" value="Estado" />
              <Select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione un estado</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En Proceso</option>
                <option value="completado">Completado</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="comentario" value="Comentario" />
              <Textarea
                id="comentario"
                name="comentario"
                value={formData.comentario}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            {/* Componente de carga de archivos */}
            <FileUploader
              onFileUpload={(file) => setFormData((prevState) => ({ ...prevState, archivo: file, respaldo: 'respaldado' }))}
              clearFileName={clearFileName} // Pasamos la prop para limpiar el nombre del archivo
            />          </div>
          <div className="flex justify-end">
            <Button type="submit">Guardar Documento</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentoForm;
