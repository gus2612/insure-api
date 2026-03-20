API - Policy Request Service

Descripción:
Este proyecto es una API desarrollada con NestJS que permite la gestión de solicitudes de pólizas (Policy Requests) y autenticación de usuarios.
La aplicación está estructurada en módulos, utiliza TypeORM para la conexión a base de datos SQL Server.

Modulos principales:

AuthModule: Encargado de la autenticación de usuarios utilizando JWT.
PolicyRequestModule: Gestiona las operaciones relacionadas con solicitudes de pólizas.

El proyecto utiliza variables de entorno para la configuración. Se dejara el .env disponible para mostrar las credenciales a crear y el nombre de la base de datos.

DB_HOST=localhost
DB_PORT=1433
DB_NAME=insurance_db
DB_USERNAME=nest_user
DB_PASSWORD=Password123!
DB_ENCRYPT=false

Instalación:
  - Instalar paqueteria con el comando npm install.

Ejecutar el proyecto:
  - Comando para ejecutar el proyecto: npm run start:dev

Autenticación: (http://localhost:3000/auth/login) URI para el uso de login.
  - La API utliza JWT (Bearer Token).

Uso en requests: (http://localhost:3000/policy-requests) URI para el uso de endpoints.
  - Authorization: Bearer <token>

En Swagger: (http://localhost:3000/api#/) Link para ingreasar a Swagger.
 1. Click en Authorize
 2. Pega solo el token
 3. Swagger agregará automáticamente el prefijo Bearer


NOTAS IMPORTANTES.
  - Para el uso de REDIS ejecutar el comando: docker exec -it e9c781832629 redis-cli.
  - Se añadio en los archivos del proyecto el archivo de postman para su visualización.