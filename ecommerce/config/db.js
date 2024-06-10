import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`${conn.connection.host}`)
    }
    catch(error){
        console.log('Error in db'.bgRed.white)
    }
};
export default connectDB;