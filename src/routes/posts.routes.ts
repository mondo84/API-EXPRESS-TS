/** 
 * Modulo de rutas de los posts (publicaciones).
 * 
 * */
import { Router } from 'express';   // Importa Modulo de rutas de express.
import { getPosts, getPostByid, createPost, deleltePost, updatePost} from './../controllers/post.controller';    // Posts Controlador.

const objRouter = Router(); // Instancia del modulo de rutas.

objRouter.route('/').get(getPosts);                 // Ruta get.
objRouter.route('/:idPost(\\d+)').get(getPostByid);       // Ruta get con parametro. Patron numerico entero +
objRouter.route('/').post(createPost);              // Ruta post.
objRouter.route('/:idPost(\\d+)').delete(deleltePost);    // Ruta delete con parametro. Patron numerico entero +
objRouter.route('/:idPost(\\d+)').put(updatePost);     // Actualiza todo el registro. Patron numerico entero +
// objRouter.route('/').patch();   // Actualiza solo una propiedad indicada.

export default objRouter;   // Exportacion por defecto, del objeto de rutas.