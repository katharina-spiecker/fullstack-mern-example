import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export default async function connectDB() {
  mongoose.connection.on('connected', () => console.log('DB connected'))
  mongoose.connection.on('error', (error) => console.error('DB Error', error))

  try {
    await mongoose.connect(process.env.DB_URI!);
    console.log('MongoDB connected successfully');
  } catch (error: any) {
      console.error('Error connecting to MongoDB:', error.message);
      process.exit(1);  // Exit because the app can't function without the DB
  }
}