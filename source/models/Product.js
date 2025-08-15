import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    thumbnail: String,
    code: { type: String, unique: true },
    stock: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
