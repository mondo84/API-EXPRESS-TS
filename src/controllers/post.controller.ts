import { Request, Response } from 'express';
import  objConnect  from './../dataBase';   // Importa objeto con la conexion.
import postI from './../interfaces/post.interface';

// Metodo que retorna una promesa del tipo response.
let getPosts = async (req: Request, res: Response) => {

    const conn = await objConnect();    // Objeto con la conexion.
    await conn.query('SELECT * FROM posts').then( (resultSet)=> { //Query SELECT.
        // Devuelve JSON con datos.
        return res.status(200).json({ datos: resultSet[0], complete: true });
    })
    .catch((err)=>{
        // Devuele un JSON con error y codigo de estado.
        return res.status(500).json({ error: err.message, complete: false });
    });
}

let getPostByid = async ( req: Request, res: Response ): Promise<Response> => {
    const id = req.params.idPost;

    try {
        const conn = await objConnect();    // Objeto con la conexion.
        const postById = await conn.query('SELECT * FROM posts WHERE id = ?', [id]);

        return res.status(200).json({
            datos: postById[0],
            status: 200,
            complete: 'ok'
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            msj: error.message
        })
    }  
}

let deleltePost = async (req: Request, res: Response) => {
    const idPost = req.params.idPost;

    try {
        const conn = await objConnect();    // Objeto con la conexion.
        conn.query('DELETE FROM posts WHERE id = ?', [idPost]);

        return res.status(200).json({
            deleted: true, 
            status: 200,
            complete: 'ok'
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            msj: error.message
        })
    }
}

let createPost = async (req: Request, res: Response): Promise<Response> => {
    const objJson: postI = req.body;

    try {
        const conn = await objConnect();                        // Objeto con la conexion.
        await conn.query('INSERT INTO posts SET ?', [objJson]); //Query insert.

        return res.status(201).json({ 
            inserted: true, 
            status: 200, 
            complete: 'ok'
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            msj: error.message
        })
    } 
}

let updatePost = async (req: Request, res: Response): Promise<Response> => {
    const idPost = req.params.idPost;
    const objJson: postI = req.body;

    try {
        const conn = await objConnect();
        await conn.query('UPDATE posts SET ? WHERE id = ?', [objJson, idPost]);

        return res.status(200).json({
            updated: true, 
            status: 200,
            complete: 'ok'
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            msj: error.message
        });
    }
    
}

// Exportacion de respuesta servidor.
export {getPosts, getPostByid, createPost, deleltePost, updatePost};
