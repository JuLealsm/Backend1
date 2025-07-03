import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());


function readData(file) {
    const data = fs.readFileSync(file, 'utf-8');
    return JSON.parse(data);
}

function writeData(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}



const productsFile = 'products.json';

app.get('/api/products', (req, res) => {
    const products = readData(productsFile);
    res.json(products);
});

app.get('/api/products/:pid', (req, res) => {
    const products = readData(productsFile);
    const product = products.find(p => p.id == req.params.pid);
    if (!product) return res.status(404).send('Producto no encontrado');
    res.json(product);
});

app.post('/api/products', (req, res) => {
    const products = readData(productsFile);
    const newProduct = {
    id: Date.now().toString(),
    ...req.body
    };
    products.push(newProduct);
    writeData(productsFile, products);
    res.status(201).json(newProduct);
});

app.put('/api/products/:pid', (req, res) => {
    const products = readData(productsFile);
    const index = products.findIndex(p => p.id == req.params.pid);
    if (index === -1) return res.status(404).send('Producto no encontrado');

    const { id, ...updates } = req.body;
    products[index] = { ...products[index], ...updates };
    writeData(productsFile, products);
    res.json(products[index]);
});

app.delete('/api/products/:pid', (req, res) => {
    let products = readData(productsFile);
    const index = products.findIndex(p => p.id == req.params.pid);
    if (index === -1) return res.status(404).send('Producto no encontrado');

    products.splice(index, 1);
    writeData(productsFile, products);
    res.send('Producto eliminado');
});



const cartsFile = 'carts.json';

app.post('/api/carts', (req, res) => {
    const carts = readData(cartsFile);
    const newCart = {
    id: Date.now().toString(),
    products: []
    };
    carts.push(newCart);
    writeData(cartsFile, carts);
    res.status(201).json(newCart);
});

app.get('/api/carts/:cid', (req, res) => {
    const carts = readData(cartsFile);
    const cart = carts.find(c => c.id == req.params.cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.json(cart.products);
});

app.post('/api/carts/:cid/product/:pid', (req, res) => {
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


const PORT = 8080;
app.listen(PORT, () => {
    console.log(`El servidor está corriendo exitosamente en el puerto ${PORT}`);
});