// Hago las importaciones de las dependencias que voy a utilizar
import express from 'express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import cors from 'cors'

//mis rutas importadas
import db from './src/config/db.js';
import authRouter from './src/routes/authRoutes.js'

//confiracion de las variables de entorno
dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000


app.use(fileUpload({
    createParentPath: true,
    limits: {fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true,
    useTempFiles: true,
}));

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ createParentPath: true }))

//rutas
app.use('/api/auth', authRouter);

// Conexion a mi base de datos
async function startServer() {
    try {
        await db.authenticate();
        console.log('Conexión exitosa a la base de datos');
        await db.sync({ force: false });
        console.log('La sincronización fue exitosa');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo y funcionando en el puerto ${PORT}`);
        });
    } catch (error) {
        console.log('Error, no se pudo conectar a la base de datos!', error);
        return;
    }
}

startServer();