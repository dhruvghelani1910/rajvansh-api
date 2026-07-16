import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI).then(() => {
    console.log(`MongoDB Connected`);
}).catch(err => {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
});

export default mongoose.connection;
