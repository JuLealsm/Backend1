import { Router } from 'express';
import { readData, writeData } from '../utils/fileManager.js';

const router = Router();
const productsFile = 'products.json';

router.get('/', (req, res) => {
    const products = readData(productsFile);
    res.json(products);
});

router.get('/:pid', (req, res) => {
    const products = readData(productsFile);
    const product = products.find(p => p.id == req.params.pid);
    if (!product) return res.status(404).send('Producto no encontrado');
    res.json(product);
});

router.post('/', (req, res) => {
    const products = readData(productsFile);
    const newProduct = {
        id: Date.now().toString(),
        ...req.body
    };
    products.push(newProduct);
    writeData(productsFile, products);
    res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) => {
    const products = readData(productsFile);
    const index = products.findIndex(p => p.id == req.params.pid);
    if (index === -1) return res.status(404).send('Producto no encontrado');

    const { id, ...updates } = req.body;
    products[index] = { ...products[index], ...updates };
    writeData(productsFile, products);
    res.json(products[index]);
});

router.delete('/:pid', (req, res) => {
    let products = readData(productsFile);
    const index = products.findIndex(p => p.id == req.params.pid);
    if (index === -1) return res.status(404).send('Producto no encontrado');

    products.splice(index, 1);
    writeData(productsFile, products);
    res.send('Producto eliminado');
});

export default router;
