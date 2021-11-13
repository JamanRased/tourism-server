const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vrvfx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('Connect The Database');

        const database = client.db("travelBdd");
        const servicesCollection = database.collection("services");
        const bookingCollection = database.collection("booking");
        
        //Get API
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        //Get Single Events
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;

            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        //POST API
        app.post('/services', async(req,res) => {
            const service = req.body;
            console.log('Submitted Api', service)

            const result= await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });
        //DELET API
        app.delete('/services/:id', async(req, res)=>{
            const id = req.params.id;
            console.log('DELET A SINGLE Service');

            const query = {_id: ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
        //Confirm Order
        app.post('/confirmOrder', async(req,res) => {
            const booking = req.body;
            console.log('Submitted Order', booking)

            const result= await bookingCollection.insertOne(booking);
            console.log(result);
            res.json(result)
        });
        app.get("/myOrders/:email", async (req, res) => {
            const result = await bookingCollection.find({ email: req.params.email })
              .toArray();
            res.send(result);
          });
        // delete order
        app.delete('/booking/:id', async(req, res)=>{
            const id = req.params.id;
            console.log('DELET A SINGLE EVENT');
            const query = {_id: ObjectId(id)};
            const result = await bookingCollection.deleteOne(query);
            res.json(result);
        });
    }
    finally{
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running The Server');
});

app.listen(port, () =>{
    console.log("Hello ", port);
})
