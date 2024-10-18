import { exit } from 'node:process';
import db from "../config/db";
import readline from 'readline';

const clearDB = async () => {
  try {
    await db.sync({ force: true });
    console.log('Datos eliminados correctamente');
    exit(0);
  } catch (error) {
    console.error('Error al eliminar los datos:', error);
    exit(1);
  }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

if (process.argv[2] === '--clear') {
  rl.question('¿Estás seguro de que deseas eliminar todos los datos de la base de datos? (sí/no): ', (respuesta) => {
    if (respuesta.toLowerCase() === 'sí') {
      clearDB();
    } else {
      console.log('Operación cancelada.');
      exit(0);
    }
  });
}
