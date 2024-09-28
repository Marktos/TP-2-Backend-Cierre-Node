import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

/**
 * genero un JWT que dura 30 días
 * 
 * @param {Object} payload - Los datos que se incluirán en el token JWT
 * @returns {string} El token JWT generado
 */
export function generateToken(payload) {
  const options = {
    expiresIn: "30d",
  };
  const token = jwt.sign(payload, "secreto", options);
  return token;
}

/**
 * hasheo la contraseña con bcrypt
 * 
 * @param {string} password - La contraseña en texto que se va a hasheada
 * @returns {Promise<string>} El hash de la contraseña
 */
export const passwordHashed = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Verifica si la contraseña hasheada es correcta
 * 
 * @param {string} enteredPassword - La contraseña que puso el usuario
 * @param {string} storedHash - La contraseña hasheada
 * @returns {Promise<boolean>} `true` si las contraseñas coinciden, `false` en caso contrario
 */
export const checkPassword = async (enteredPassword, storedHash) => {
  return await bcrypt.compare(enteredPassword, storedHash);
};
