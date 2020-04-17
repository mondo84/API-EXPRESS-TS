/** 
 * Modulo de rutas de los casos.
 * 
 * */
import { Router } from 'express';   // Importa Modulo de rutas de express.
import { getCasos, createCaso, getCasoById } from './../controllers/casos.controllers';

const objRutasCaso = Router();

objRutasCaso.route('/').get(getCasos);                  // Ruta get.
objRutasCaso.route('/:idCaso(\\d+)').get(getCasoById);  // Ruta get con patron de solo numeros enteros
objRutasCaso.route('/').post(createCaso);               // Ruta post.


export default objRutasCaso;

/** 
 * Dependencias para produccion
 * 
 *  "bcryptjs": "^2.4.3",    (codifica las claves)
    "body-parser": "^1.19.0", (parsea los datos)
    "cors": "^2.8.5",       ( Permite todas las peticiones HTTP CORS.)
    "express": "^4.17.1",   (modulo de express)
    "jsonwebtoken": "^8.5.1",   (genera token)
    "mongoose": "^5.9.4"    (trabaja con mongo db)
    "morgan": "^1.10.0",    (reinicia el servidor automatico)
    "mysql2": "^2.1.0"      (trabaja con mysql)
 * 
 *  dependencias solo para desarrollo.
 *  "devDependencies": {
    "@types/express": "^4.17.6",
    "@types/morgan": "^1.9.0",
    "@types/mysql2": "github:types/mysql2",
    "@types/jsonwebtoken": "^8.3.9",
    "@types/bcryptjs": "^2.4.2",
    "nodemon": "^2.0.2",
    "ts-node": "^8.8.2",
    "typescript": "^3.8.3"
  }
 * **/