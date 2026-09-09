require('dotenv').config();
const sequelize = require('./db/database');
const Producto = require('./models/Producto');
const Usuario = require('./models/usuario');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const runConsole = async () => {
    try {
        await sequelize.authenticate();
        const args = process.argv.slice(2);
        const command = args[0];

        switch (command) {
            case '--list-products':
                const productos = await Producto.findAll();
                console.log('\n=== PRODUCTOS EN MYSQL ===');
                console.table(productos.map(p => p.toJSON()));
                break;

            case '--add-product':
                const [nombre, precio, stock] = [args[1], Number(args[2]), Number(args[3])];
                if (!nombre || isNaN(precio)) {
                    console.log('\nUso: node console.js --add-product "Nombre" <precio> <stock>');
                    break;
                }
                const nuevoProd = await Producto.create({ nombre, precio, stock: stock || 0 });
                console.log('\nProducto creado:', nuevoProd.toJSON());
                break;

            case '--add-user':
                // Nuevo comando para crear usuarios compatibles con JWT desde consola
                const [uNombre, email, rawPassword] = [args[1], args[2], args[3]];
                if (!uNombre || !email || !rawPassword) {
                    console.log('\nUso: node console.js --add-user "Nombre" "email@correo.com" "password"');
                    break;
                }
                const hashedPassword = await bcrypt.hash(rawPassword, 10);
                const nuevoUser = await Usuario.create({ nombre: uNombre, email, password: hashedPassword });
                console.log('\nUsuario registrado con éxito desde consola:', { id: nuevoUser.id, nombre: nuevoUser.nombre, email: nuevoUser.email });
                break;

            case '--read-logs':
                try {
                    const logs = fs.readFileSync('./access.log', 'utf8');
                    console.log('\n=== AUDITORÍA DE LOGS ===\n' + logs);
                } catch (e) {
                    console.log('\nNo existen registros de logs.');
                }
                break;

            default:
                console.log(`
Comandos disponibles para la Consola:
  node console.js --list-products
  node console.js --add-product "Nombre" <precio> <stock>
  node console.js --add-user "Nombre" "email" "password"
  node console.js --read-logs
        `);
                break;
        }
    } catch (error) {
        console.error('Error en el script de consola:', error.message);
    } finally {
        process.exit(0);
    }
};

runConsole();