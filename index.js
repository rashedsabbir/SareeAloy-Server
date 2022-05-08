const express=require("express")
const cors=require("cors")
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId=require("mongodb").ObjectId
require("dotenv").config()
const app=express()
const port=process.env.PORT || 4000

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
      const inventories = database.collection("inventories");
      
      const gallery = database.collection("gallery");
     
      const delivers = database.collection("deliver");
      
    app.get("/inventories",async(req,res)=>{
      const count=await inventories.find({}).count()
      const page=req.query.page
      const size=parseInt(req.query.size)
      let inventory;
      if(page){
         inventory=await inventories.find({}).skip(page*size).limit(size).toArray()

      }
      else(
       inventory=await inventories.find({}).toArray()

      )
      // console.log(products.length)
      res.json({
        count,
        inventory
      })
    })
    // app.get("/banner",async(req,res)=>{
    //   const result=await banner.find({}).toArray()
    //   res.json(result)
    // })
    app.get("/deliver/:id",async(req,res)=>{
      const id=req.params.id
      const query={_id:ObjectId(id)}
      const deliver=await delivers.findOne(query)
      res.json(deliver)
    })
    app.get("/deliver",async(req,res)=>{
      let query={}
      const email=req.query.email
     if(email){
     query={email:email}
     }
     const cursor= delivers.find(query)
     const deliver=await cursor.toArray()
     console.log(deliver)
     res.json(deliver)
    })
    app.delete("/deliver/:id",async(req,res)=>{
      const id=req.params.id
    const item={_id:ObjectId(id)}
  const deliver=await delivers.deleteOne(item)
  res.json(deliver) 
  })
    app.get("/myorder/:email",async(req,res)=>{
      const email=req.params.email
    const query={email:email}
  const deliver=await delivers.find(query).toArray()
  res.json(deliver) 
  })
    app.put("/deliver/:id",async(req,res)=>{
      const id=req.params.id
      const filter={_id:ObjectId(id)}
      const item=req.body
      const option={upsert:true}
      const updateDocs={
      $set:{
       status:item.status
      }
      }
      const deliver=await delivers.updateOne(filter,updateDocs,option)
      res.json(deliver)
          })
    app.get("/gallery",async(req,res)=>{
      const result=await gallery.find({}).toArray()
      res.json(result)
    })
    // 
    app.get("/inventories/:id",async(req,res)=>{
      const id=req.params.id
      const query={_id:ObjectId(id)}
      const result=await inventories.findOne(query)
      res.json(result)
    })
    app.post("/inventories",async(req,res)=>{
      const item=req.body
      const result=await inventories.insertOne(item)
      res.json(result)
    })
    app.post("/deliver",async(req,res)=>{
      const item=req.body
      const deliver=await delivers.insertOne(item)
      res.json(deliver)
    })
    app.put("/inventories/update/:id",async(req,res)=>{
const id=req.params.id
const filter={_id:ObjectId(id)}
const item=req.body
const option={upsert:true}
const updateDocs={
$set:{
  title:item.title,
  
  price:item.price,
  
  supplier:item.supplier,
photo:item.photo,
description:item.description,
introduction:item.introduction,

}
}
const result=await inventories.updateOne(filter,updateDocs,option)
res.json(result)
    })
  
    app.delete("/inventories/:id",async(req,res)=>{
      const id=req.params.id
    const item={_id:ObjectId(id)}
  const result=await inventories.deleteOne(item)
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