import { Router } from 'express';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

const router = Router();

router.get('/products', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    try {
        const totalProducts = await Product.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);
        const products = await Product.find()
        .skip(limit * (page - 1))
        .limit(limit);

        res.render('products', {
        products,
        page,
        totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevPage: page - 1,
        nextPage: page + 1,
        });
    } catch (err) {
        res.status(500).send('Error loading products');
    }
    });

    router.get('/products/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) return res.status(404).send('Producto no encontrado');

        res.render('productDetail', { product });
    } catch (err) {
        res.status(500).send('Error loading product detail');
    }
    });

    router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) return res.status(404).send('Carrito no encontrado');

        res.render('cartDetail', { cart });
    } catch (err) {
        res.status(500).send('Error loading cart');
    }
});

export default router;
