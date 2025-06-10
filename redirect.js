// public/redirect.js
// Este script se ejecuta cuando GitHub Pages sirve el 404.html
// y redirige a la aplicación de React Router.

// Obtiene la ruta completa solicitada por el navegador (ej. /barber-turnos-app/nuevo)
var fullPath = window.location.pathname;

// Define el nombre del repositorio, que es el subdirectorio en GitHub Pages
var repoName = "/barber-turnos-app/";

// Define la URL base de tu aplicación desplegada en GitHub Pages
var baseUrl = "https://esbreenn.github.io/barber-turnos-app/";

// Calcula la sub-ruta original que React Router debería manejar
// Por ejemplo, si fullPath es "/barber-turnos-app/nuevo", newPath será "/nuevo"
var newPath = fullPath.substring(fullPath.indexOf(repoName) + repoName.length);

// Redirige al navegador a la URL base de la aplicación con la ruta original
// pasada como un hash (#) en la URL. React Router puede leer este hash.
// Usamos window.location.replace para evitar que el 404 se quede en el historial.
window.location.replace(baseUrl + "#" + newPath);