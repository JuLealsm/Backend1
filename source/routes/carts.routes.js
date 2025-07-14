import { Router } from 'express';
import { readData, writeData } from '../utils/fileManager.js';

const router = Router();
const cartsFile = 'carts.json';

router.post('/', (req, res) => {
    const carts = readData(cartsFile);
    const newCart = {
        id: Date.now().toString(),
        products: []
    };
    carts.push(newCart);
    writeData(cartsFile, carts);
    res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
    const carts = readData(cartsFile);
    const cart = carts.find(c => c.id == req.params.cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.json(cart.products);
});

router.post('/:cid/product/:pid', (req, res) => {
    const carts = readData(cartsFile);
    const cart = carts.find(c => c.id == req.params.cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');

    const productIndex = cart.products.findIndex(p => p.product === req.params.pid);
    if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
    } else {
        cart.products.push({ product: req.params.pid, quantity: 1 });
    }

    writeData(cartsFile, carts);
    res.json(cart);
});

export default router;
