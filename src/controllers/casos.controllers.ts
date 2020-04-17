import { Request, Response } from 'express';
import objConexion from './../dataBase';

let getCasos =  async (req: Request, res: Response): Promise<Response> =>  {
        try {
            let objConn = await objConexion();
            const objDatos = await objConn.query('SELECT * FROM casos');

            return res.status(200).json({ 
                datos: objDatos[0],
                status: 200,
                complete: true
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                complete: false,
                msj: error.message
            });
        }
}

let getCasoById = async ( req: Request, res: Response ): Promise<Response> => {
    
    const idCaso = req.params.idCaso;   // Recupera el id.

    try {
        const objConn = await objConexion();    // Conexion.
        const objDatos = await objConn.query('SELECT * FROM casos WHERE id = ?', [idCaso]); // Query SELECT.

            console.log(objDatos[0]);
        
        return res.status(200).json({
            datos: objDatos[0],
            status: 200,
            complete: true
        });
    } catch(error) {
        return res.status(500).json({
            status: 500,
            complete: false,
            msj: error.message
        });
    }
}

let createCaso = async (req: Request, res: Response) => {
    const objDatos = req.body;

    try {
        const objConn = await objConexion();
        await objConn.query('INSERT INTO casos SET ?', [objDatos]);

        return res.status(200).json({
            status: 200,
            complete: true
        });
    } catch (error) {
        return res.status(200).json({
            status: 500,
            complete: false,
            msj: error.message
        });
    }
}

// Exporta metodos.
export {getCasos, createCaso, getCasoById};