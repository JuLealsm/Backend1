import express from 'express';
import connectDB from './config/db.js';
import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/carts.routers.js';
import viewsRouter from './routes/views.router.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


connectDB();


app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);


app.use('/', viewsRouter);


import handlebars from 'express-handlebars';
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});


