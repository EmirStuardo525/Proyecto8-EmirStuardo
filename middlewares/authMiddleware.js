const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET ;

const verificarToken = (req, res, next) => {
    // Obtener el encabezado 'Authorization'
    const authHeader = req.headers['authorization'];

    // El formato esperado es "Bearer <TOKEN>"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Se requiere un token de autenticación.' });
    }

    try {
        // Verificar validez y expiración del token
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Guardar los datos del usuario en la petición
        next(); // Pasar a la siguiente función o controlador
    } catch (error) {
        return res.status(403).json({ error: 'Token inválido o expirado' });
    }
};

module.exports = verificarToken;