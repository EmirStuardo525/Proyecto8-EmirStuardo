const Producto = require('../models/Producto');

const getProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

const createProducto = async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;
    const nuevoProducto = await Producto.create({ nombre, precio, stock });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear producto' });
  }
};

const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, stock } = req.body;
    const producto = await Producto.findByPk(id);

    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    await producto.update({ nombre, precio, stock });
    res.status(200).json(producto);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar producto' });
  }
};

const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);

    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    await producto.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

module.exports = { getProductos, createProducto, updateProducto, deleteProducto };