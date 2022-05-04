import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('The Green House is running....')
})

// connect with mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3rgm8.mongodb.net/greenWarehouseDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// verify jwt token
function verifyAuthToken(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).send({ message: "Unauthorized Access." })
    }
    const accessToken = authHeader.split(" ")[1]
    jsonwebtoken.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY, function (error, decoded) {
        if (error) {
            return res.status(403).send({ message: "Forbidden Access" })
        }
        req.decoded = decoded
        next();
    })

}

async function runServer() {
    try {
        // database connection
        await client.connect();
        const productCollection = client.db("WarehouseManagement").collection("products");
        const feedbackCollection = client.db("WarehouseManagement").collection("feedbacks");
        const faqCollection = client.db("WarehouseManagement").collection("faq");

        // Product Api

        // get all the products
        app.get('/items', async (req, res) => {
            const cursor = productCollection.find({})
            const items = await cursor.toArray();
            res.send(items)
        })


        // insert and update products
        app.put('/items', async (req, res) => {
            const item = req.body;
            // item._id && delete item._id;
            // create filter for an old product to update
            const filter = { productId: item.productId };
            // create a new item if no item is matched
            const options = { upsert: true };
            // update a item
            const updateItem = {
                $set: { ...item }
            }
            const result = await productCollection.updateOne(filter, updateItem, options)
            res.send(result)
        })
        // delete data
        app.delete('/items', async (req, res) => {
            const { id } = req.query;
            const result = await productCollection.deleteOne({ _id: ObjectId(id) });
            res.send(result)
        })
        // update quantity
        app.put('/items/qtnUpdate', async (req, res) => {
            const { productQuantity, productId } = req.body;
            // update a item
            const updateItem = {
                $set: { quantity: productQuantity }
            }
            const result = await productCollection.updateOne({ productId }, updateItem)
            res.send(result)
        })


        // Feedback Api

        // get all the data
        app.get('/feedbacks', async (req, res) => {
            const cursor = feedbackCollection.find({})
            const items = await cursor.toArray();
            res.send(items)
        })

        // FAQ Api

        // get all the data
        app.get('/faq', async (req, res) => {
            const cursor = faqCollection.find({})
            const items = await cursor.toArray();
            res.send(items)
        })

        // create token
        app.post("/createToken", async (req, res) => {
            const email = req.body
            const authAccessToken = jsonwebtoken.sign(email, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: "1d" })
            res.send({ authAccessToken })
        })

        // get logged in user products
        app.get('/items-user', verifyAuthToken, async (req, res) => {
            const { email } = req.query
            const decodedEmail = req.decoded.email
            console.log(decodedEmail, email);
            if (email !== decodedEmail) {
                res.status(403).send({ message: "Forbidden Access" })
                return;
            }
            const cursor = productCollection.find({ userEmail: email })
            const items = await cursor.toArray();
            res.send(items)
        })




    } finally {

    }
}
runServer().catch(console.dir);


app.listen(port, console.log(`Server running on ${port}`))