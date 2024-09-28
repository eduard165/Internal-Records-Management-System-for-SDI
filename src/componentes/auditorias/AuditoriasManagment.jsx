import React, { useEffect, useState } from 'react';
import { Table, Badge } from 'flowbite-react';
import useExcel from '@/hooks/auditorias/useExcel';  // Importamos el hook

export default function RegistrosTable() {
  const [registros, setRegistros] = useState([]);
  const { getArchivo2024 } = useExcel(); // Usamos la función del hook

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getArchivo2024(); // Recuperamos los datos
        const formattedData = data.map(row => ({
          respaldo: row[0],           // Respaldo (pendiente o respaldado)
          noOficio: row[1],           // Número de oficio
          seguimientoOficio: row[2],  // Seguimiento al oficio
          noCarpetaFisica: row[3],    // Número de la carpeta física
          carpetaLabel: row[4],       // Nombre de la carpeta física
          auditoria: row[5],          // Auditoría
          emitidoPor: row[6],         // Emitido por
          fechaOficio: row[7],        // Fecha del oficio
          descripcion: row[8],        // Descripción
          fechaArchivo: row[9],       // Fecha del archivo
          capturadoPor: row[10],      // Capturado por
          estado: row[11],            // Estado (pendiente, en proceso, completado)
          comentario: row[12],        // Comentarios
          archivo: row[13],           // URL del archivo subido
        }));
        setRegistros(formattedData);
      } catch (error) {
        console.error('Error al cargar los registros:', error);
      }
    };

    fetchData(); // Ejecutamos la carga de datos al montar el componente
  }, [getArchivo2024]); // Añadimos getArchivo2024 como dependencia

  return (
    <div className="min-h-screen bg-cover bg-center py-8 px-4 sm:px-6 lg:px-8" style={{backgroundImage: "url('/EdificioA.jpg?height=1080&width=1920')"}}>
      <div className="max-w-7xl mx-auto bg-white bg-opacity-90 p-6 rounded-lg shadow-lg backdrop-blur-sm overflow-x-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Registros</h2>
        <Table hoverable>
          <Table.Head>
            {/* Cabeceras de la tabla */}
            <Table.HeadCell>RESPALDO</Table.HeadCell>
            <Table.HeadCell>No. de Oficio</Table.HeadCell>
            <Table.HeadCell>Seguimiento a oficio</Table.HeadCell>
            <Table.HeadCell>No. Carpeta Física</Table.HeadCell>
            <Table.HeadCell>Nombre Carpeta Física</Table.HeadCell>
            <Table.HeadCell>Auditoría</Table.HeadCell>
            <Table.HeadCell>Emitido por</Table.HeadCell>
            <Table.HeadCell>Fecha de oficio</Table.HeadCell>
            <Table.HeadCell>Descripción</Table.HeadCell>
            <Table.HeadCell>Fecha de archivo</Table.HeadCell>
            <Table.HeadCell>Capturado por</Table.HeadCell>
            <Table.HeadCell>Estado</Table.HeadCell>
            <Table.HeadCell>Comentario</Table.HeadCell>
            <Table.HeadCell>Archivo</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {registros.map((registro, index) => (
              <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {registro.respaldo}
                </Table.Cell>
                <Table.Cell>{registro.noOficio}</Table.Cell>
                <Table.Cell>{registro.seguimientoOficio}</Table.Cell>
                <Table.Cell>{registro.noCarpetaFisica}</Table.Cell>
                <Table.Cell>{registro.carpetaLabel}</Table.Cell> {/* Nombre de la carpeta */}
                <Table.Cell>{registro.auditoria}</Table.Cell>
                <Table.Cell>{registro.emitidoPor}</Table.Cell>
                <Table.Cell>{new Date(registro.fechaOficio).toLocaleDateString()}</Table.Cell>
                <Table.Cell>{registro.descripcion}</Table.Cell>
                <Table.Cell>{new Date(registro.fechaArchivo).toLocaleDateString()}</Table.Cell>
                <Table.Cell>{registro.capturadoPor}</Table.Cell>
                <Table.Cell>
                  <Badge color={
                    registro.estado === 'completado' ? 'success' :
                    registro.estado === 'en_proceso' ? 'warning' :
                    'failure'
                  }>
                    {registro.estado}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{registro.comentario}</Table.Cell>
                <Table.Cell>
                  {registro.archivo ? (
                    <a href={registro.archivo} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                      Ver archivo
                    </a>
                  ) : (
                    'No disponible'
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
