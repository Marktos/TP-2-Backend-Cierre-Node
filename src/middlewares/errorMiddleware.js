const errorMiddleware = (error, req, res, next) => {
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
};

export default errorMiddleware;

