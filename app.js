require('dotenv').config(); // 1. Cargar variables de entorno siempre al inicio
const express = require('express');
const path = require('path');
const sequelize = require('./db/database');
const Routes = require('./routes/routes'); // Contiene las nuevas rutas de login y JWT
const logAuditoria = require('./middlewares/loggerMiddleware');
const Producto = require('./models/Producto');

const app = express();

// Motor de vistas HBS
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logAuditoria);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Vista Principal HBS (Renderiza el catálogo)
app.get('/', async (req, res) => {
    try {
        const productos = await Producto.findAll({ raw: true });
        res.render('index', { productos, titulo: 'Catálogo de Productos' });
    } catch (error) {
        res.status(500).send('Error al cargar la base de datos MySQL');
    }
});

// Registrar el enrutador
app.use('/api', Routes);

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/upload', (req, res) => {
  res.render('upload');
});

const PORT = process.env.PORT || 3000;

// Sincronizar base de datos e iniciar servidor
sequelize.sync()
    .then(() => {
        console.log('Conexión con MySQL establecida correctamente.');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error('Error al conectar con MySQL:', err));