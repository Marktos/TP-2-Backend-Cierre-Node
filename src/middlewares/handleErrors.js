import { validationResult } from "express-validator";

//Maneja los errores de express-validator. Si hay errores, los manda en la respuesta.

const handleErrors = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  next();
};

export {handleErrors}