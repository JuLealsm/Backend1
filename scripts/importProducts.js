import mongoose from 'mongoose';
import Product from '../source/models/Product.js';
import fs from 'fs';

// Función para importar productos desde archivo JSON a la base de datos MongoDB
async function importProducts() {
    try {
        // Conectar a la base de datos MongoDB
        await mongoose.connect(
            'tu_conexion_mongodb',
            {}
        );
        console.log('Conectado a MongoDB para importación.');

        // Leer archivo products.json y parsear a objeto
        const data = fs.readFileSync('./products.json', 'utf-8');
        const products = JSON.parse(data);

        // Eliminar productos actuales para evitar duplicados
        await Product.deleteMany();

        // Insertar los productos del archivo JSON
        await Product.insertMany(products);

        console.log('Productos importados con éxito!');
        process.exit(0);
    } catch (error) {
        console.error('Error en la importación:', error);
        process.exit(1);
    }
}

importProducts();
