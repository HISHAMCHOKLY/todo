require('dotenv').config()
const express=require('express')
const app=express()
const cors=require('cors')
const MongoClient=require('mongodb').MongoClient

const url=process.env.DB_URL
let port=process.env.PORT||4000

const dbClient=new MongoClient(url,{useNewUrlParser:true,useUnifiedTopology:true})
app.use(cors())
app.use(express.json())
dbClient.connect((err)=>{
    if(err){
        console.log('connection failed')
    }
    else{
        console.log('connected')
    }
})


app.get('/',async (req,res)=>{

    let data=[]
    const database=dbClient.db('hisham')
    let d=await database.collection('todos').find()
    await d.forEach((i)=>{
        data.push(i);
    })
 
    res.json({data})
    
})


app.post('/add',async(req,res)=>{
    console.log(req.body)
    const database=dbClient.db('hisham')
    let id=`${Date.now()}`
    let text=req.body.text
    let data=await database.collection('todos').insertOne({id:id,text:text})
    res.json({success:true})

})


app.post('/delete',async(req,res)=>{
    console.log(req.body)

    const database=dbClient.db('hisham')
    await database.collection('todos').deleteOne({id:req.body.id})
    res.json({success:true})
})


app.listen(port,()=>{
    console.log('app running on port '+port);
})