require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const express = require('express');
const cors = require('cors');

const app = express();
const port= process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

// Construct URI dynamically
const uri = `mongodb+srv://${username}:${password}@cluster1.ub0vp7n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`

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
await client.connect();
    
const gymproCollection = client.db("gymproDB").collection("gympro");

app.post("/schedule",async(req,res)=>{
  const result = await gymproCollection.insertOne(req.body);
  res.send(result);
})

//get data from api
app.get("/schedule",async(req,res)=>{
  const result=await gymproCollection.find().toArray();
  res.send(result);
})

//delete specific data from api
app.delete("/schedule/:id",async(req,res)=>{
  const id=req.params.id;
  const query={_id: new ObjectId(id)};
  const result=await gymproCollection.deleteOne(query);
  res.send(result);
})


//get specific data from api
app.get("/schedule/:id",async(req,res)=>{
  const id=req.params.id;
  const query={_id: new ObjectId(id)};
  const result=await gymproCollection.findOne(query);
  res.send(result);
})

//update data from api
app.put("/schedule/:id",async(req,res)=>{
  const id=req.params.id;
  const query={_id: new ObjectId(id)};
  const updateDoc={
    $set:req.body
  }
  const result=await gymproCollection.updateOne(query,updateDoc);
  res.send(result);
})


console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   
  }
}
run().catch(console.dir);


