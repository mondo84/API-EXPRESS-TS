/** 
 * Middleware que verifica el token capturado.
 */

import { Request, Response, NextFunction } from 'express'
import  jwt  from 'jsonwebtoken';

let verifyToken = (req: Request, res: Response, next: NextFunction) => {

    // Formato del token: Authorization Bearer <access_token>
    const bearerHeader = req.headers['authorization'];
    // const token = req.headers['x-access-token'];

    console.log('Middleware ' + bearerHeader);
    // Verifica el token.
    if ( typeof bearerHeader !== 'undefined'){
        // Creando el espacio en el token.
        const bearer = bearerHeader.split(' ');

        const bearerToken = bearer[1];  // Obtengo el token en el array.

        req.params.token = bearerToken;

        console.log(bearerToken);
        next();
    } else {
        // req.params.token = "parametro guardado en el require";
        // console.log(req.params.token);
        // res.sendStatus(403); // Forbidden.
        res.status(403).json({ msj: 'No hay encabezado' });
    }

}

export default verifyToken;

// VALIDAR EL TOKEN EN ESTE MIDDLEWARE PARA QUE VALIDE EL TOKEN
// PARA TODAS LAS PETICIONES. BORRAR EL metodo verify() del metodo
// getUsuario.