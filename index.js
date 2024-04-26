const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fvwg0tw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const database = client.db("touristsDB");
    const tourists = database.collection("tourists");

    app.post('/tourist', async (req, res) => {
      const newSpot = req.body;
      const result = await tourists.insertOne(newSpot);
      res.send(result);
    })

    app.get('/tourist', async (req, res) => {
      const cursor = tourists.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/tourist/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tourists.findOne(query);
      res.send(result);
    })

    app.put('/tourist/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateSpot = req.body;

      const newSpot = {
        $set: {
          spotName: updateSpot.spotName,
          location: updateSpot.location,
          country: updateSpot.country,
          season: updateSpot.season,
          avgCost: updateSpot.avgCost,
          TravelTime: updateSpot.TravelTime,
          TotalVisitor: updateSpot.TotalVisitor,
          image: updateSpot.image,
          shortDescription: updateSpot.shortDescription,
        }
      }
      const result = await tourists.updateOne(filter,newSpot,options);
      res.send(result);
    })

    app.delete('/tourist/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await tourists.deleteOne(query);
      res.send(result);
    })

    // app.get('/tourist/:email', async(req,res)=>{
    //   console.log(req.params.email);
    // const email = req.params.email;
    // const result = await tourists.find({ userEmail: email }).toArray(); // Convert cursor to array
    // res.send(result);
    // })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send("Hello Kilbil");
});

app.listen(port, () => {
  console.log(`Current port ${port}`);
})
