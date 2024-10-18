import dotenv from 'dotenv';
import express from "express"
import cors from "cors";
import morgan from "morgan";
import db from './src/config/db.js';
import fileUpload from "express-fileupload";
import Router from "./src/routes/authRoutes.js";


dotenv.config();
const app = express();  
app.use(express.json());
const port = 3000;
app.use(morgan('dev'));
app.use(cors());



db.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');

    // Sincronizar la base de datos, forzando la recreación de las tablas
    return db.sync();
  })
  .then(() => {
    console.log('Base de datos sincronizada correctamente. Todas las tablas han sido recreadas.');
  })
  .catch(error => {
    console.error('No se pudo sincronizar la base de datos:', error);
  });

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(Router);//mi ruta
app.use(fileUpload());

app.listen(port,()=>{
    console.log("En marcha")
})

export default app;