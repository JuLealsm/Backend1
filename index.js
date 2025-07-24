import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

import productsRouter from './src/routes/products.routes.js';
import cartsRouter from './src/routes/carts.routes.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


import { readData } from './src/utils/fileManager.js';
app.get('/', (req, res) => {
    const products = readData('products.json');
    res.render('home', { products });
});


app.get('/realtimeproducts', (req, res) => {
    const products = readData('products.json');
    res.render('realTimeProducts', { products });
});


io.on('connection', socket => {
    console.log('Cliente conectado!');

    socket.on('addProduct', product => {
        const products = readData('products.json');
        const newProduct = { id: Date.now().toString(), ...product };
        products.push(newProduct);
        writeData('products.json', products);
        io.emit('productsUpdated', products);
    });

    socket.on('deleteProduct', id => {
        let products = readData('products.json');
        products = products.filter(p => p.id !== id);
        writeData('products.json', products);
        io.emit('productsUpdated', products);
    });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

