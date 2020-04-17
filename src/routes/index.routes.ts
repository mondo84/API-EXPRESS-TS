/**
 *  Archivo de rutas del proyecto.
 */

 // Importa Modulo de rutas de express.
import { Router } from 'express';
import { indexWelcome } from './../controllers/index.controller';

const router = Router();

router.route('/').get(indexWelcome);

// Exportacion por default del objeto de rutas.
export default router;