const express=require("express")
const cors=require("cors")
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId=require("mongodb").ObjectId
require("dotenv").config()
const app=express()
const port=process.env.PORT || 5000

app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    res.send("Successfully Run The Node And Express")
})
app.get("/check",(req,res)=>{
    res.send("Check  this for remote url change")
})

// Mongo connect 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.poglh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      await client.connect();
      const database = client.db("sareealoy");
      
      const offers = database.collection("offers");
      const gallery = database.collection("gallery");
     
      
    app.get("/gallery",async(req,res)=>{
      const result=await gallery.find({}).toArray()
      res.json(result)
    })

    

    app.get("/offers",async(req,res)=>{
      const count=await offers.find({}).count()
      const page=req.query.page
      const size=parseInt(req.query.size)
      let offer;
      if(page){
         offer=await offers.find({}).skip(page*size).limit(size).toArray()

      }
      else(
       offer=await offers.find({}).toArray()

      )
      // console.log(products.length)
      res.json({
        count,
        offer
      })
    })

    app.get("/offers/:id",async(req,res)=>{
      const id=req.params.id
      const query={_id:ObjectId(id)}
      const result=await offers.findOne(query)
      res.json(result)
    })

    app.post("/offers",async(req,res)=>{
      const item=req.body
      const result=await offers.insertOne(item)
      res.json(result)
    })


   
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.listen(port,()=>{
    console.log("Running the Localhost",`http://localhost:${port}`)
})