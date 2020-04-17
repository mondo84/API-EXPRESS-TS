/**
 * Archivo de arranque de la app.
 */
import { App } from "./app";    // Importacion de la clase que tiene la configuracion del servidor.

// Recibe numero o string, y el parametro es opcional.
function main(port?: number | string) {
    const objApp = new App(port);   // Instancia de la clase del servidor.
    objApp.listen();                // Metodo que ejecuta el servidor.
}

// Ejecucion de la funcion / si no se pasa puerto, se establece el 3000 por default.
main(3000);