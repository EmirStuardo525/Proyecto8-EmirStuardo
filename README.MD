# Sistema de Gestión de Productos y Usuarios (Módulo 8) 

API RESTful y catálogo web desarrollado en **Node.js** con **Express**, **Sequelize (MySQL)**, **Handlebars** y autenticación basada en **JWT**. Incluye un script interactivo por línea de comandos (CLI) y un sistema automático de auditoría de logs.

---

##  Características Principales

-  **Autenticación y Seguridad:** Registro, inicio de sesión y emisión de Tokens JWT.
-  **Gestión de Catálogo:** CRUD completo de productos con ORM Sequelize.
-  **Subida de Archivos:** Carga de avatares de usuario procesados con Multer (máx. 5MB, solo imágenes).
-  **Renderizado Dinámico:** Vistas web con Handlebars (`.hbs`) para el catálogo, login y carga de archivos.
-  **Middleware de Auditoría:** Registro automático de solicitudes HTTP, tiempos de respuesta y errores en `access.log`.
-  **Consola CLI:** Herramienta por consola para administración rápida (creación de usuarios/productos y lectura de logs).

---

##  Tecnologías Utilizadas

- **Entorno de Ejecución:** Node.js
- **Framework Web:** Express.js
- **Base de Datos:** MySQL
- **ORM:** Sequelize
- **Motor de Plantillas:** Handlebars (`hbs`)
- **Autenticación:** JSON Web Token (`jsonwebtoken`) 
- **Gestión de Archivos:** Multer
- **Variables de Entorno:** `dotenv`

# Ejecutar Proyecto

1. Clonar e instalar
- git clone [https://github.com/EmirStuardo525/Proyecto8-EmirStuardo.git]
- cd Modulo8-Proyecto
- npm install

2. Configurar Variables de Entorno
- Editar el archivo .env

3. Ejecución del Proyecto
- npm start
- npm run dev (Modo de pruebas)

# Uso de consola

1. Listar todos los productos en formato tabla
node console.js --list-products

2. Agregar un nuevo producto (Nombre, Precio, Stock)
node console.js --add-product "Laptop Pro" 1200 15

3. Crear un usuario con contraseña 
node console.js --add-user "Admin" "admin@correo.com" "secreto123"

4. Ver el registro de auditoría (logs)
node console.js --read-logs


# Rutas de la API

## Login
## Método,Ruta,Descripción,Requiere Token
- POST,/api/register, Registrar un nuevo usuario, Sin Token
- POST,/api/login, Iniciar sesión y obtener JWT, Sin Token

## Usuarios
## Método,Ruta,Descripción,Requiere Token
- GET,/api/usuarios, Obtener lista de usuarios, Token
- PUT,/api/usuarios/:id, Actualizar datos de usuario, Token
- DELETE,/api/usuarios/:id, Eliminar usuario, Token
- POST,/api/usuarios/avatar, Subir foto de perfil (multipart/form-data), Token

## Productos
## Método,Ruta,Descripción,Requiere Token
- GET,/api/productos, Obtener catálogo de productos, Sin Token
- POST,/api/productos, Crear un producto, Token
- PUT,/api/productos/:id, Actualizar un producto, Token
- DELETE,/api/productos/:id, Eliminar un producto, Token 