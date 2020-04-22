/**
 * Calse:
 * Modulo de rutas de los posts (publicaciones).
 * */
import { Router } from 'express';   // Importa Modulo de rutas de express.
import { getPosts, getPostByid, createPost,
         deleltePost, updatePost} from './../controllers/post.controller';    // Posts Controlador.
import verifyToken from '../middlewares/verifyToken';   // Importa middleware verifica token.

const objRouter = Router(); // Instancia del modulo de rutas.

objRouter.route('/').get(verifyToken, getPosts);                    // Ruta get.
objRouter.route('/:idPost(\\d+)').get(verifyToken, getPostByid);    // Ruta get con parametro. Patron numerico entero +
objRouter.route('/').post(verifyToken, createPost);                 // Ruta post.
objRouter.route('/:idPost(\\d+)').delete(verifyToken, deleltePost); // Ruta delete con parametro. Patron numerico entero +
objRouter.route('/:idPost(\\d+)').put(verifyToken, updatePost);     // Actualiza todo el registro. Patron numerico entero +

export default objRouter;   // Exportacion por defecto, del objeto de rutas.
