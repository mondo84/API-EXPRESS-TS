/**
 * Archivo de configuracion del servidor.
 * */
import express , {Application} from 'express';  // Modulo de express. importacion por default y explicita.
import morgan from 'morgan';                    // Importacion por default
import cors from 'cors';

// === Importacion por default de los Modulos de rutas.
import objRutaIndex from './routes/index.routes';
import objRutaPosts from './routes/posts.routes';
import objRutaCaso from './routes/casos.routes'
import objRutaUsuario from './routes/usuario.routes';

class App {

    private app: Application;   // Variable tipo Interface Application de express().

    // Ejecuta el servidor. EL puerto es opcional. numero / string
    constructor(private argPort?: number | string) {
        this.app = express();   // Instancia de express.

        this.settings();        // Ejecuta el metodo que setea la propiedad port.
        this.middleware();      // Ejecuta middleware.
        this.routes();          // Metodo que ejecuta el modulo de rutas.
    }

    settings(){
        // Se crea una propiedad 'port' con el valor
        // pasado en el constructor, sino, por variable de entrono
        // sino, el puerto es 3000 por defecto.
        this.app.set('port', this.argPort || process.env.PORT || 3000 );
    }

    middleware() {
        // Muestra por consola msj de desarrollo.
        this.app.use(morgan('dev'));
        // this.app.use(express.urlencoded({extended: false}));    // Recibe datos de formulario.
        this.app.use(express.json()); // Recibe datos en formato JSON. (Aplica para las API).
    }

    // Metodo que llama el modulo de rutas.
    routes(){

        // const whitelist = ['http://localhost:4200', 'http://localhost:6000'];

        /* Configuracion fija(peticiones http) de cors. */
        const corsOptions = {
          origin: 'http://localhost:4200',
          optionsSuccessStatus: 200
        }

        this.app.use(cors(corsOptions));
        this.app.use(objRutaIndex);
        this.app.use('/posts', objRutaPosts );      // Rutas para los posts.
        this.app.use('/casos', objRutaCaso);        // Rutas para los casos.
        this.app.use('/usuario', objRutaUsuario);   // Rutas para los usuarios.
    }

    public listen() {
        // Escuchador de servidor.
        this.app.listen(this.app.get('port'), ()=>{
            // Muestra mensaje y llama a la propiedad port seteada con el puerto.
            console.log(`Corriendo en el puerto ${this.app.get('port')}`);
        });
    }
}

export {App}    // Exportacion de la clase.
