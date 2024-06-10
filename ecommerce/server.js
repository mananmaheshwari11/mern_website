import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import author from './routes/author.js';
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cors from 'cors';
import path from 'path';
import exp from "constants";


dotenv.config();
// backend app configuration
const app = express();

// database connection
connectDB();


// middlewares
app.use(cors());
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname,'./ecommerce/build')))

//routes
app.use('/api/v1/auth',author);
app.use('/api/v1/category',categoryRoutes)
app.use('/api/v1/product',productRoutes)


app.use("*",function(req,res){
    res.sendFile(path.join(__filename,'./ecommerce/build/index.html'))
})

//port feature
const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log("Server threshold starts on".bgCyan.white);
});
