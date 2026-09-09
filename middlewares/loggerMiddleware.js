const fs = require('fs');
const path = require('path');

const logAuditoria = (req, res, next) => {
    const inicio = Date.now();
    // Escuchar el evento cuando la respuesta termine de enviarse
    res.on('finish', () => {
        const duracion = Date.now() - inicio;
        const statusCode = res.statusCode;

        // Identificar si fue acierto o error según el código HTTP
        const estado = statusCode >= 400 ? 'ERROR' : 'OK';

        // Capturar mensaje de error opcional si res.locals.errorMessage fue asignado
        const detalleError = res.locals.errorMessage ? ` | Detalle: ${res.locals.errorMessage}` : '';

        const logEntry = `[${new Date().toISOString()}] [${estado}] Código: ${statusCode} | Método: ${req.method} | Ruta: ${req.originalUrl} | IP: ${req.ip} | Tiempo: ${duracion}ms${detalleError}\n`;

        // Escribir en el archivo access.log
        fs.appendFile(path.join(__dirname, '../access.log'), logEntry, (err) => {
            if (err) console.error('Error escribiendo en el log:', err);
        });

        // Mostrar también en consola con formato limpio
        console.log(logEntry.trim());
    });

    next();
};

module.exports = logAuditoria;