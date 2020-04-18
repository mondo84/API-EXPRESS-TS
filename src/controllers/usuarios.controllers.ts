import {Request, Response} from 'express';
import objConexion from './../dataBase'
import usuarioI from './../interfaces/usuario.interface';
import objBcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'; // Modulo que Genera y valida token.

// ========= Registro de usuario.
let getUsuario = (req: Request, res: Response) => {
    const token = req.params.token;

    // ====== Se decodifica el token. 
    // @Params: token, clave secreta, callback funcion(error-verificando, datos-token: idUsu, creacionToken, expiracionToken)
    jwt.verify(token, 'MyclaveSecreta', async (err, authData) => {
        if(err) {
            return res.status(403).json({ msj: 'Forbidden' });  // Devuelve json.
        } else {
            const objConn = await objConexion();    // conexion a la BD.
            await objConn.query('SELECT id, nombre, email FROM usuario')    // Consulta. Devuelve promesa.
            .then((row)=>{
                if(JSON.parse(JSON.stringify(row[0]))[0] == undefined){ 
                    // console.log('No content');   // Debug.
                    return res.status(204); // Devuelve un estado no content. no devuelve nada.
                } else { 
                    return res.status(200).json({ datos: row[0], authData, complete: true}); // Devuelve JSON con datos. 
                }
            })
            .catch((erro)=>{    // Captura error de promesa.
                return res.status(500).json({ msj: 'Algo anda mal', detail: erro.message });  // Devuelve json.
            });  // Consulta.
        }
    });
}

let getUsuarioById = async (req: Request, res: Response) => {
    // console.log(req.params);     // Recibe id de busqueda por parametro.
    const idBusqueda = req.params.idUsuParam;

    const objConn = await objConexion();    // Conexion con la DB.
    objConn.query('SELECT id, nombre, email FROM usuario WHERE id = ?', [idBusqueda])
    .then( (row) => {
        // console.log(  JSON.parse(JSON.stringify(row[0]))[0].nombre );    // Debug.
        // console.log(JSON.parse(JSON.stringify(row[0]))[0]);

        if(JSON.parse(JSON.stringify(row[0]))[0] == undefined){ 
            // console.log('No content');   // Debug.
            return res.status(204); // Devuelve un estado no content. no devuelve nada.
        } else { 
            return res.status(200).json({ datos: row[0], complete: true}); // Devuelve JSON con datos. 
        }
    } )
    .catch( (err) => {
        // console.error(`Algo anda mal: ${err.message}`);  // Debug.
        return res.status(200).json({ msg: err.message, complete: false}); // // Devuelve JSON con error..
    } );
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

export { createUsuario, sigIn, getUsuario, getUsuarioById };