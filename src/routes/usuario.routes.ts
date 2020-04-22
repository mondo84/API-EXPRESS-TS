/**
 * Modulo de rutas de los casos.
 *
 * */
import { Router } from 'express';   // Importa Modulo de rutas de express.
import { createUsuario, sigIn, getUsuario, getUsuarioById
        ,updateUsuario, deleteUsuario} from './../controllers/usuarios.controllers'; // Importa controlador usuario.
import verifyToken from '../middlewares/verifyToken';   // Importa middleware verifica token.

const objRutasUsuario = Router();   // Instancia de rutas.

objRutasUsuario.route('/').get(verifyToken, getUsuario);    // Forma larga con middleware.
//objRutasUsuario.get('/', verifyToken, getUsuario);        // Forma corta con middleware.
objRutasUsuario.route('/:idUsuParam(\\d+)').get(verifyToken, getUsuarioById);   // Ruta get con patron de solo numeros enteros
objRutasUsuario.route('/').post(verifyToken,createUsuario);                     // Ruta post. Crea usuario.
objRutasUsuario.route('/sigin').post(sigIn);                                    // Ruta post. Autenticacion.
objRutasUsuario.route('/:idUsuParam(\\d+)').put(verifyToken, updateUsuario);    // Ruta modificacionde usuario.
objRutasUsuario.route('/:idUsuParam(\\d+)').delete(verifyToken, deleteUsuario); // Ruta borra usuario.

export default objRutasUsuario;
