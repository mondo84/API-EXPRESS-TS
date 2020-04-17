/** 
 * Archivo de conexion con la base de datos.
 */
import { createPool } from 'mysql2/promise';    // Conexion por promesa.

let connect = async () => {

    const connectionObj = await createPool({    // Instancia de objeto con la conexion.
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'node_mysql_ts',
        connectionLimit: 10
    });

    return connectionObj;   // Retorna objeto con la conexion.
}

// Exporta la funcion de conexion.
// Retorna una promesa.
export default connect;