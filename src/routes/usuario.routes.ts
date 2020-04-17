/** 
 * Modulo de rutas de los casos.
 * 
 * */
import { Router } from 'express';   // Importa Modulo de rutas de express.
import { createUsuario, sigIn, getUsuario } from './../controllers/usuarios.controllers';
import verifyToken from '../middlewares/verifyToken';

const objRutasUsuario = Router();   // Instancia de rutas.

// objRutasUsuario.route('/').get(getUsuario);     // Ruta get.
objRutasUsuario.get('/', verifyToken, getUsuario);
// objRutasCaso.route('/:idCaso(\\d+)').get(getCasoById);   // Ruta get con patron de solo numeros enteros
objRutasUsuario.route('/').post(createUsuario);             // Ruta post. Crea usuario.
objRutasUsuario.route('/sigin').post(sigIn);                // Ruta post. Autenticacion.


export default objRutasUsuario;