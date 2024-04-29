const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fvwg0tw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const database = client.db("touristsDB");
    const tourists = database.collection("tourists");
    const countryDB = database.collection("countryDB");
    const popularDB = database.collection("popularDB");
    

    app.post('/tourist', async (req, res) => {
      const newSpot = req.body;
      const result = await tourists.insertOne(newSpot);  
      res.send(result);
    })

    app.get('/country', async(req,res)=>{
      const cursor = countryDB.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/popular', async(req,res)=>{
      const cursor = popularDB.find();
      const result = await cursor.toArray();
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

    app.get('/countrySpot/:country', async(req,res)=>{
      const countrySpots = req.params.country;
      const result = await tourists.find({ country: countrySpots }).toArray();
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

    app.get('/emailTour/:email', async(req,res)=>{
    const email = req.params.email;
    const result = await tourists.find({ userEmail: email }).toArray();
    res.send(result);
    })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send("Hello Kilbil");
});

app.listen(port, () => {
  console.log(`Current port ${port}`);
})
