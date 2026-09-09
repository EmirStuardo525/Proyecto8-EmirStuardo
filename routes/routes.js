const express = require('express');
const router = express.Router();

const UsuarioController = require('../controllers/UsuarioController');
const ProductoController = require('../controllers/ProductoController');
const verificarToken = require('../middlewares/authMiddleware');
const logAuditoria = require('../middlewares/loggerMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// --- RUTAS DE AUTENTICACIÓN ---
router.post('/register', logAuditoria,UsuarioController.createUsuario);
router.post('/login', logAuditoria,UsuarioController.loginUsuario); // POST /login exigido por la lección

// --- RUTAS DE USUARIO ---
router.get('/usuarios', verificarToken, UsuarioController.getUsuario); // Ruta Protegida 1
router.post('/usuarios', logAuditoria,UsuarioController.createUsuario);
router.put('/usuarios/:id', verificarToken, UsuarioController.updateUsuario);
router.delete('/usuarios/:id', verificarToken, UsuarioController.deleteUsuario);

// RUTA PARA SUBIR ARCHIVOS (Usando upload.single)
router.post('/usuarios/avatar', verificarToken, upload.single('avatar'), UsuarioController.uploadAvatar);
// --- RUTAS DE PRODUCTOS ---
router.get('/productos',logAuditoria, ProductoController.getProductos); // Pública (Catálogo)
router.post('/productos', verificarToken, ProductoController.createProducto); // Ruta Protegida 2
router.put('/productos/:id', verificarToken, ProductoController.updateProducto); // Ruta Protegida 3
router.delete('/productos/:id', logAuditoria,verificarToken, ProductoController.deleteProducto); // Ruta Protegida 4

module.exports = router;