import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// genero un JWT que dura 30 días
export function generateToken(payload) {
  const options = {
    expiresIn: "30d",
  };
  const token = jwt.sign(payload, "secreto", options);
  return token;
}

//hasheo la contraseña con bcrypt
export const passwordHashed = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

//Verifico si la contraseña hasheada es correcta
export const checkPassword = async (enteredPassword, storedHash) => {
  return await bcrypt.compare(enteredPassword, storedHash);
};
