import { Router } from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = Router();

// Crear carrito vacío
router.post('/', async (req, res) => {
    try {
        const cart = await Cart.create({ products: [] });
        res.status(201).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener carrito por ID con productos poblados
router.get('/:id', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id).populate('products.product');
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Agregar producto al carrito
router.post('/:id/product/:productId', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        const product = await Product.findById(req.params.productId);
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

        const item = cart.products.find(p => p.product.toString() === req.params.productId);
        if (item) {
            item.quantity += 1;
        } else {
            cart.products.push({ product: req.params.productId, quantity: 1 });
        }

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar producto específico del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        cart.products = cart.products.filter(p => p.product.toString() !== pid);

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar todos los productos del carrito
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const products = req.body.products;

        if (!Array.isArray(products)) {
            return res.status(400).json({ error: 'products debe ser un arreglo' });
        }

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        cart.products = products;

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar sólo la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({ error: 'quantity debe ser un número positivo' });
        }

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        const item = cart.products.find(p => p.product.toString() === pid);
        if (!item) return res.status(404).json({ error: 'Producto no encontrado en el carrito' });

        item.quantity = quantity;

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        cart.products = [];

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
