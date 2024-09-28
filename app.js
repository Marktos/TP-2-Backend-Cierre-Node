// Hago las importaciones de las dependencias que voy a utilizar
import express from 'express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';

//mis rutas importadas
import db from './src/config/db.js';
import router from './src/routes/pagosRoutes.js';
import adminRouter from './src/routes/adminRoutes.js'
import authRouter from './src/routes/authRoutes.js'
import userRouter from './src/routes/userRoutes.js'
import pagoRouter from './src/routes/pagosRoutes.js'




// Conexion a mi base de datos
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
app.use(cors({}))
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ createParentPath: true }))

//rutas
app.use('/user', usuarioRoutes);
app.use('/api/admins', adminRouter);
app.use('/api/auth', authRouter);
app.use('/api/pagos', pagosRoutes);
