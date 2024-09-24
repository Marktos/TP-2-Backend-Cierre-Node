import express from 'express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';

//mis rutas importadas
import db from './src/config/db.js';
import router from './src/routes/pagosRoutes.js';

//confiracion de las variables de entorno
dotenv.config()


const app = express
const PORT = process.env.PORT || 3000

app.use(fileUpload({
    createParentPath: true,
    limits: {fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true,
    useTempFiles: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ createParentPath: true }))

//rutas
app.use('/user', usuarioRoutes);
app.use('/pagos', pagosRoutes);


async function startServer() {
    try {
        await db.authenticate();
        console.log('Conexion exitosa a la base de datos');
        await db.sync({ force: true });
        console.log('La sincronizacion fue exitosa');
    } catch (error) {
        console.log('Error, no se pudo conectar a la base de datos!');
    }
    app.listen(PORT, () => {
        console.log(`Servidor corriendo y funcionando en el puerto ${PORT}`);
    });
};

startServer();
