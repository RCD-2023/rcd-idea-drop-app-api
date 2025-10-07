import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log('✅ MongoDB Connected...');
  } catch (error) {
    console.error('❌ Error connecting MongoDB:', err.message);
    process.exit(1); // Oprește aplicația dacă nu se conectează
  }
};

export default connectDB;
