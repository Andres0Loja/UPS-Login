# UPS Correo Electronico

Sistema web basico de inicio de sesion y gestion local de usuarios hecho con HTML, CSS y JavaScript.

## Que hace

- Permite iniciar sesion con usuarios guardados en el navegador.
- Incluye un administrador por defecto.
- Redirige usuarios normales a una pagina que muestra `Entraste`.
- Redirige administradores al panel de administracion.
- Permite que el administrador cree, modifique y elimine usuarios.
- Mantiene la sesion activa mientras se navega usando `localStorage`.
- Permite cerrar sesion correctamente.

## Como ejecutar el proyecto

Abre el archivo `index.html` directamente en el navegador.

Tambien puedes servir la carpeta con cualquier servidor estatico simple, por ejemplo con la extension Live Server de VS Code.

## Usuario por defecto

- Usuario: `admin`
- Contrasena: `admin`
- Rol: administrador

## Como funciona el login

El formulario de `index.html` valida que usuario y contrasena no esten vacios. Luego busca el usuario en la base local del navegador.

Si las credenciales son correctas:

- Rol `admin`: redirige a `admin.html`.
- Rol `user`: redirige a `dashboard.html`.

Si las credenciales son incorrectas, muestra un mensaje de error.

## Como funciona el rol de administrador

El administrador entra a `admin.html`, donde puede ver los usuarios registrados, crear usuarios nuevos, modificar usuarios existentes y eliminarlos. Esa pagina valida que exista una sesion activa de administrador; si no existe, redirige al login.

## Como se crean nuevos usuarios

Desde `admin.html`, completa:

- Usuario
- Contrasena
- Rol: administrador o usuario normal

El sistema valida campos vacios y evita usuarios duplicados. Los usuarios creados se guardan en `localStorage` y pueden iniciar sesion despues.

## Como se modifican o eliminan usuarios

En `admin.html`, cada usuario tiene acciones:

- `Editar`: carga los datos en el formulario para modificar usuario, contrasena o rol.
- `Eliminar`: borra el usuario despues de confirmar la accion.

Validaciones importantes:

- No se puede crear o modificar un usuario con nombre duplicado.
- No se puede eliminar el usuario que tiene la sesion activa.
- No se puede dejar el sistema sin al menos un administrador.
- No se puede quitar el rol de administrador a la propia sesion activa.

## Base de datos local

La base local usa `localStorage` con estas claves:

- `upsCorreoElectronico.users`: lista de usuarios.
- `upsCorreoElectronico.session`: sesion activa.

Nota: esta solucion es adecuada para practica o prototipos locales. No debe usarse como seguridad real en produccion porque las contrasenas quedan almacenadas en el navegador.

## Archivos principales

- `index.html`: pantalla de inicio de sesion.
- `dashboard.html`: pagina de usuario normal.
- `admin.html`: panel de administracion y creacion de usuarios.
- `assets/css/styles.css`: estilos generales del sistema.
- `assets/js/storage.js`: lectura y escritura en `localStorage`.
- `assets/js/auth.js`: login, sesion y cierre de sesion.
- `assets/js/login.js`: comportamiento del formulario de login.
- `assets/js/admin.js`: creacion, modificacion, eliminacion y listado de usuarios.
- `assets/js/dashboard.js`: validacion y mensaje de la pagina de usuario.
