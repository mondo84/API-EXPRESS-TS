import {Request, Response} from 'express';
import objConexion from './../dataBase'
import usuarioI from './../interfaces/usuario.interface';
import objBcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'; // Modulo que Genera y valida token.

// ========= Registro de usuario.
let getUsuario = async (req: Request, res: Response) => {
    const dataToken = JSON.parse(req.params.datosToken);    // Casting de string a JSON.
    
    const objConn = await objConexion();    // conexion a la BD.
    await objConn.query('SELECT id, nombre, email FROM usuario') // Consulta. Devuelve promesa.
    .then((row)=>{
        // console.log(  JSON.parse(JSON.stringify(row[0]))[0].nombre ); // Debug.
        if(JSON.parse(JSON.stringify(row[0]))[0] == undefined){ 
            return res.status(204).json({ msg: 'no content' }); // Devuelve un estado no content. no devuelve nada.
        } else {
            // Devuelve JSON con datos, e informacion del token.
            return res.status(200).json({ datos: row[0], complete: true, datosToken: dataToken}); 
        }
    })
    .catch((erro)=>{    // Captura error de promesa.
        return res.status(500).json({ msj: 'Algo anda mal', complete: false }); // Devuelve JSON con mensaje.
    });
}

let getUsuarioById = async (req: Request, res: Response) => {
    // console.log(req.params);     // Recibe id de busqueda por parametro. // Debug.
    const idBusqueda = req.params.idUsuParam;
    const dataToken =  JSON.parse(req.params.datosToken);   // Casting de String a JSON.

    const objConn = await objConexion();    // Conexion con la DB.
    objConn.query('SELECT id, nombre, email FROM usuario WHERE id = ?', [idBusqueda]) // Consulta. Devuelve promesa.
    .then( (row) => {
        // console.log(  JSON.parse(JSON.stringify(row[0]))[0].nombre ); // Debug.
        if(JSON.parse(JSON.stringify(row[0]))[0] == undefined){ // Valida datos de registro.
            return res.status(204).json({ msg: 'no content' }); // Devuelve un estado no content. no devuelve nada.
        } else { 
            // Devuelve JSON con datos, e informacion del token.
            return res.status(200).json({ datos: row[0], complete: true, datosToken: dataToken }); 
        }
    } )
    .catch( (err) => {
        return res.status(500).json({ msg: 'Algo anda mal', complete: false }); // Devuelve JSON con mensaje.
    } );
}

let createUsuario = async (req: Request, res: Response) => {
    const objDatos: usuarioI = req.body;        // Se recuperan los datos del request.

    validaCorreo(objDatos.email.toLowerCase())  // Verifica existencia del correo
    .then(  async (resultCont) => {
        // console.log( JSON.parse(JSON.stringify(resultCont[0]))[0].cuenta );  // Debug
        const countEmail = JSON.parse(JSON.stringify(resultCont[0]))[0].cuenta
        switch(countEmail){
            case 0: // Email disponible.
                const salt = await objBcrypt.genSalt(10);   // Se aplica un hash 10 veces y se guarda.

                objBcrypt.hash(objDatos.password, salt)     // Se aplica hash al password. 
                .then( async (result) => {
                    const obj = {   nombre: objDatos.nombre.toLowerCase(), 
                                    email: objDatos.email.toLowerCase(), 
                                    password: result};

                    const objConn = await objConexion();
                    await objConn.query('INSERT INTO usuario SET ?', [obj])
                    .then( async (rows) => {
                        const affectedRows = await JSON.parse(JSON.stringify(rows[0])).affectedRows;
                        const idInsert     = await JSON.parse(JSON.stringify(rows[0])).insertId;
                        return res.status(200).json({ idInsert, affectedRows, complete: true });
                    })
                    .catch( async (err) => {
                        return res.status(500).json({ msg: 'Algo anda mal', complete: false });
                    });
                }).catch( error => { return res.status(500).json({ msg: 'Algo anda mal', complete: false }); });

                break;
            default:    // Duplicidad de email.
                return res.status(500).json({ msg: 'Algo anda mal', complete: false });
        }
    })
    .catch((err) => {   // Captura error de validacion de correo.
        console.log(err.message);   // Retorna error.
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
           return res.status(200).json({ msg: 'usuario no existe', status: 200 });
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

let validaCorreo = async ( argEmail: string ): Promise<any> => {
    
    const objConn = await objConexion();    // obeto de conexion
    // // Busca por email.
    const objResult = await objConn.query('SELECT COUNT(*) AS cuenta FROM usuario WHERE email = ?', [argEmail]);
    return objResult;
}

export { createUsuario, sigIn, getUsuario, getUsuarioById };