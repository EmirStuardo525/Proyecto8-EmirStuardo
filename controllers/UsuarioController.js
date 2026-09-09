const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getUsuario = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({ attributes: { exclude: ['password'] } });
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

const createUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Faltan campos obligatorios (nombre, email, password)' });
        }

        //const hashedPassword = await bcrypt.hash(password, 10);

        const newUsuario = await Usuario.create({
            nombre,
            email,
            password
        });

        res.status(201).json({
            mensaje: 'Usuario creado exitosamente',
            usuario: { id: newUsuario.id, nombre: newUsuario.nombre, email: newUsuario.email }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear usuario: ' + error.message });
    }
};

const updateUsuario = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const { nombre, email } = req.body;
        await usuario.update({ nombre, email });
        return res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};

const deleteUsuario = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await usuario.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};

const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña requeridos' });
        }

        // Buscar el usuario por email
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Validar contraseña
        //const passwordValido = await bcrypt.compare(password, usuario.password);
        //console.log(password);
        //console.log(usuario.password);
        if (usuario.password !== password) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Generar Token JWT
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            token
        });
    } catch (error) {
        res.locals.errorMessage = error.message;
        res.status(500).json({ error: 'Error en el login: ' + error.message });
    }
};

const uploadAvatar = async (req, res) => {
    try {
        // Tomar el ID desde el token decodificado por verificarToken
        const id = req.user.id;

        if (!req.file) {
            return res.status(400).json({ error: 'Por favor selecciona un archivo' });
        }

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const avatarUrl = `/uploads/${req.file.filename}`;
        await usuario.update({ avatar: avatarUrl });

        res.status(200).json({
            mensaje: 'Avatar subido y actualizado exitosamente',
            avatar: avatarUrl
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al subir el archivo: ' + error.message });
    }
};

// EXPORTACIÓN OBLIGATORIA DE TODAS LAS FUNCIONES
module.exports = {
    getUsuario,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    loginUsuario,
    uploadAvatar
};