import dotenv from 'dotenv';
dotenv.config();

//convert secrtet into UintArray
export const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
