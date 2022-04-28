import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import itemRoutes from './routes/Items.js';

// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors())
app.use(express.json({limit: "30mb",extended:true}));
app.use(express.urlencoded({limit: "30mb",extended:true}));

app.use('/items',itemRoutes)


app.get('/',(req,res)=>{
    res.send('The Green House is running....')
})

// connect with mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3rgm8.mongodb.net/greenWarehouseDatabase?retryWrites=true&w=majority`;
mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>app.listen(port,console.log(`Server running on ${port}`))).catch(err=>console.log(err));



// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// async function runServer(){
//     try {
//         // database connection
//         await client.connect();
//         const productCollection = client.db("GreenHouse").collection("products");

//         // Product Api

//         // get all the data
//         app.get('/item',async (req,res)=>{
//             const cursor = productCollection.find({})
//             const items = await cursor.toArray();
//             res.send(items)
//         })

       
        
//     } finally {
        
//     }
// }
// runServer().catch(console.dir);
// server listening


