# Sistema de Gestión de Documentos de Auditoría - SDI 2024

## Introducción

El presente documento detalla el desarrollo y funcionamiento del **"Sistema de Gestión de Documentos de Auditoría"** implementado para la Secretaría de Desarrollo Institucional (SDI) en 2024. Este sistema tiene como objetivo mejorar la organización, almacenamiento y gestión de los archivos relacionados con auditorías dentro de una plataforma basada en **SharePoint**.

El sistema permite a los usuarios institucionales registrar documentos asociados a auditorías, subir archivos y organizarlos dentro de un sistema de carpetas estructurado en **SharePoint**. Esto mejora la accesibilidad, garantiza un almacenamiento eficiente y facilita la búsqueda y consulta de los documentos.

## Objetivos del Sistema

- **Optimizar la carga y organización** de archivos digitales relacionados con auditorías, utilizando **Microsoft SharePoint** como plataforma de almacenamiento.
- **Facilitar el acceso** a los documentos mediante una estructura de carpetas eficiente y un motor de búsqueda para localizar archivos específicos.
- **Asegurar la autenticación de los usuarios** mediante **MSAL (Microsoft Authentication Library)**, garantizando que solo los usuarios institucionales autorizados puedan acceder al sistema.

## Alcance

Este sistema cubre las siguientes funcionalidades:

- Inicio de sesión mediante cuentas institucionales de **Microsoft**.
- Registro y carga de documentos relacionados con auditorías en **SharePoint**.
- Organización de los documentos dentro de un sistema de carpetas estructurado.
- Búsqueda y consulta de documentos registrados en la plataforma.
- Actualización de metadatos y archivos previamente almacenados.

## Tecnologías Utilizadas

El sistema ha sido desarrollado utilizando las siguientes tecnologías:

- **React.js** para el desarrollo del frontend.
- **Microsoft SharePoint** para el almacenamiento de documentos.
- **Microsoft Graph API** para la interacción con los servicios de SharePoint.
- **MSAL (Microsoft Authentication Library)** para la autenticación de usuarios.
- **Flowbite** para los componentes de UI.

## Diagrama de Arquitectura

| **Componente**             | **Descripción**                                                                                                                                     | **Interacción**                                                                                                                                                                                                                                                                  |
|----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Frontend (Next.js + React)** | La interfaz de usuario que permite a los usuarios interactuar con el sistema, manejar formularios y visualizar datos.                              | Interactúa con el backend y las APIs a través de peticiones HTTP (por ejemplo, para autenticación y gestión de archivos).                                                                                                                                                         |
| **Backend (Express)**       | Middleware ligero que puede manejar la carga de archivos y enrutamiento del lado del servidor.                                                     | Procesa peticiones del frontend y actúa como intermediario para las APIs externas (como SharePoint).                                                                                                                                                                             |
| **APIs (Microsoft Graph API)** | Proporciona acceso a los servicios de Microsoft 365 como SharePoint para subir, consultar, y gestionar archivos y carpetas.                       | El backend interactúa directamente con Microsoft Graph API para gestionar archivos y carpetas en SharePoint.                                                                                                                                                                      |
| **Autenticación (MSAL)**    | Protocolo de autenticación de Microsoft utilizado para validar a los usuarios mediante tokens.                                                      | El frontend gestiona la autenticación con MSAL y el backend valida el acceso mediante tokens de Microsoft.                                                                                                                                                                        |

## Descripción del Sistema

El **Sistema de Gestión de Documentos de Auditoría** es una solución diseñada para facilitar el registro, almacenamiento y organización de documentos relacionados con auditorías. El sistema ofrece una interfaz intuitiva que permite a los usuarios institucionales realizar las siguientes tareas:

1. **Autenticación Segura**: El sistema utiliza **MSAL** para validar que solo los usuarios institucionales autorizados puedan acceder.
2. **Registro de Documentos**: Los usuarios pueden registrar documentos relacionados con auditorías a través de un formulario intuitivo.
3. **Carga de Archivos**: Los archivos se cargan y almacenan en una estructura organizada de carpetas en **SharePoint**.
4. **Búsqueda y Consulta**: Los usuarios pueden buscar y consultar documentos de auditoría a través de un motor de búsqueda eficiente.
5. **Actualización de Documentos**: Es posible actualizar los metadatos o los archivos previamente registrados.

## Conclusión

El **Sistema de Gestión de Documentos de Auditoría** implementado para la Secretaría de Desarrollo Institucional (SDI) mejora notablemente la forma en que se gestionan los documentos relacionados con auditorías. Con una integración profunda con **Microsoft SharePoint** y una autenticación segura mediante **MSAL**, se garantiza una solución eficiente, segura y escalable para la gestión de archivos.
