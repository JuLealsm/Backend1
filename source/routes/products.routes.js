import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

// GET /api/products - Lista productos con paginación, filtro y ordenamiento
router.get('/', async (req, res) => {
    try {
        // Obtener parámetros de query para paginación y filtros
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort === 'asc' ? 1 : req.query.sort === 'desc' ? -1 : null;
        const queryParam = req.query.query || null;

        // Construir filtro según query
        let filter = {};
        if (queryParam) {
            if (queryParam.startsWith('category:')) {
                const category = queryParam.split(':')[1];
                filter.category = category;
            } else if (queryParam === 'stock>0') {
                filter.stock = { $gt: 0 };
            }
        }

        // Contar total de productos para calcular paginación
        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);
        const currentPage = page > totalPages ? totalPages : page;

        // Construir consulta con filtros y ordenamientos
        let query = Product.find(filter);
        if (sort) {
            query = query.sort({ price: sort });
        }
        query = query.skip(limit * (currentPage - 1)).limit(limit);

        const products = await query.exec();

        // Construcción de links para navegación en paginación
        const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
        const hasPrevPage = currentPage > 1;
        const hasNextPage = currentPage < totalPages;
        const prevPage = hasPrevPage ? currentPage - 1 : null;
        const nextPage = hasNextPage ? currentPage + 1 : null;

        const prevLink = hasPrevPage
            ? `${baseUrl}?limit=${limit}&page=${prevPage}${req.query.sort ? `&sort=${req.query.sort}` : ''}${req.query.query ? `&query=${req.query.query}` : ''}`
            : null;
        const nextLink = hasNextPage
            ? `${baseUrl}?limit=${limit}&page=${nextPage}${req.query.sort ? `&sort=${req.query.sort}` : ''}${req.query.query ? `&query=${req.query.query}` : ''}`
            : null;

        // Responder con el objeto esperado
        res.json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage,
            nextPage,
            page: currentPage,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// POST /api/products - Crear nuevo producto
router.post('/', async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/products/:id - Actualizar producto por ID
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/products/:id - Eliminar producto por ID
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
