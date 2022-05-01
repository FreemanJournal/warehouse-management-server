import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';



const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors())
// app.use(express.json())
app.use(express.json({limit: "30mb",extended:true}));
app.use(express.urlencoded({limit: "30mb",extended:true}));


app.get('/',(req,res)=>{
    res.send('The Green House is running....')
})

// connect with mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3rgm8.mongodb.net/greenWarehouseDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function runServer(){
    try {
        // database connection
        await client.connect();
        const productCollection = client.db("WarehouseManagement").collection("products");
        const feedbackCollection = client.db("WarehouseManagement").collection("feedbacks");
        const faqCollection = client.db("WarehouseManagement").collection("faq");

        // Product Api

        // get all the data
        app.get('/items',async (req,res)=>{
            const cursor = productCollection.find({})
            const items = await cursor.toArray();
            res.send(items)
        })
        // insert and update
        app.post('/items',async (req,res)=>{
            const item = req.body;
            item._id && delete item._id;
            // create filter for an old product to update
            const filter = {productId:item.productId} ;
            // create a new item if no item is matched
            const options = {upsert:true};
            // update a item
            const updateItem = {
                $set:{...item}
            }
            const result = await productCollection.updateOne(filter,updateItem,options)
            res.send(result)
        })

         // Feedback Api

        // get all the data
        app.get('/feedbacks',async (req,res)=>{
            const cursor = feedbackCollection.find({})
            const items = await cursor.toArray();
            res.send(items)
        })

         // FAQ Api

        // get all the data
        app.get('/faq',async (req,res)=>{
            const cursor = feedbackCollection.find({})
            const items = await cursor.toArray();
            res.send(items)
        })


       
        
    } finally {
        
    }
}
runServer().catch(console.dir);


app.listen(port,console.log(`Server running on ${port}`))