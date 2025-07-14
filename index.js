import express from 'express';
import productsRouter from './src/routes/products.routes.js';
import cartsRouter from './src/routes/carts.routes.js';

const app = express();
app.use(express.json());

// Rotas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
