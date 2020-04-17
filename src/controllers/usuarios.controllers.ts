import {Request, Response} from 'express';
import objConexion from './../dataBase'
import usuarioI from './../interfaces/usuario.interface';
import objBcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'; // Modulo que Genera y valida token.

// ========= Registro de usuario.
let getUsuario = (req: Request, res: Response) => {
    const token = req.params.token;

    // ====== Se decodifica el token. Params: token y clave secreta.
    jwt.verify(token, 'MyclaveSecreta', async (err, authData) => {
        if(err) {
            return res.status(403).json({ msj: 'Forbidden' });  // Devuelve json.
        } else {
            try {
                const objConn = await objConexion();    // conexion a la BD.
                const objDatos = await objConn.query('SELECT id, nombre, email FROM usuario');  // Consulta.
                return res.status(200).json({ datos: objDatos[0], authData });
            } catch (error) {   // Captura error.
                return res.status(500).json({ msj: 'Algo anda mal' });  // Devuelve json.
            }
        }
    });
}

let createUsuario = async (req: Request, res: Response) => {
        const objDatos: usuarioI = req.body;        // Se recuperan los datos del request.
        const salt = await objBcrypt.genSalt(10);   // Se aplica un hash 10 veces y se guarda.

        objBcrypt.hash(objDatos.password, salt)     // Se aplica hash al password. 
        .then( async (result) => {
            const obj = {   nombre: objDatos.nombre.toLowerCase(), 
                            email: objDatos.email.toLowerCase(), 
                            password: result};

            const objConn = await objConexion();
            await objConn.query('INSERT INTO usuario SET ?', [obj]);

            return res.status(200).json({
                status: 200,
                complete: true
            });
        }).catch( error => {
            return res.status(500).json({
                status: 500,
                complete: false,
                msj: error.message
            });
        });
}

let sigIn = async (req: Request, res: Response) => {
    const datos: usuarioI = req.body;       // Recibo los datos del front.
    const objConn = await objConexion();    // objeto de conexion.

    const rows = await objConn.query('SELECT COUNT(*) AS cuenta FROM usuario WHERE email = ?', [datos.email]);  // Busca por email.
    const result = JSON.parse(JSON.stringify(rows));    // parsea de objeto a string, y de string a json.

    const numEmail = result[0][0].cuenta;   // Captura numero de coincidencias.

    switch(numEmail) {  // Valida si existe el email.
        case 0:
           return res.status(200).json({ msj: 'usuario no existe', status: 200 });
        case 1:

            const rows = await objConn.query('SELECT id, password FROM usuario WHERE email = ?', [datos.email]);  // Busca por email.
            const row = JSON.parse(JSON.stringify(rows[0]));    // parsea de objeto a string, y de string a json.

            // Compara el password capturado, con el de la base de datos. Retorna boolean en una promesa.
            objBcrypt.compare(datos.password, row[0].password)
            .then( (isValid) => {

                if(isValid){    // Si la clave es valida.
                    // Crea el token con el id del usuario autenticado, la clave secreta y 24 horas de validez.
                    const jsonToken = jwt.sign( { idUser : row[0].id }, 'MyclaveSecreta', { expiresIn: 60 * 60 * 24 });
                    res.status(200).json({ auth: true, token: jsonToken }); // Respuesta del servidor. Devuelve un json con el token.

                } else {    // Si la clave no es valida.
                    res.status(200).json({ auth: false, token: null }); // Devuelve json con token null y auth false.
                }
            }).catch ( (err) => { return res.status(500).json({ msj: err.message, status: 500 }); });   // Captura error.

            break;
        default:    // El correo no es unico.
            return res.status(500).json({ msj: 'Algo anda mal', status: 500 })
    }
}

export { createUsuario, sigIn, getUsuario };