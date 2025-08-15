import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(
        'mongodb+srv://jhuly815:GaZDnPBeKoZX1Irx@cluster0.xrynmdn.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
        );
        console.log('Conectado al MongoDB Atlas');
    } catch (err) {
        console.error('Error al conectarse al MongoDB:', err.message);
        process.exit(1);
    }
};

export default connectDB;
