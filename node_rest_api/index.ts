

import express,{ Express, Request,Response } from "express";
import "dotenv/config";
import morgan from "morgan";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import userRoute from "./src/routes/users"
import authRoute from './src/routes/auth';
import postRoute from './src/routes/posts'
import groupRoute from './src/routes/group'
import profileRoute from './src/routes/profile';
import multer from "multer"
import * as path from "path"
import * as fs from 'fs-extra'
import conversationsRoute from './src/routes/conversations';
import messageRoute from './src/routes/message';
import bodyParser from 'body-parser'

// console.log(__dirname)
// console.log(path)
require('dotenv').config();
const app : Express=express();
const port:any=process.env.MONGO_URL
mongoose.connect(port).then(
    ()=>{
        console.log("connected to mongo");
    }
)
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

// middlware
app.use(express.json());
app.use(helmet());
app.use(cors(
    {
        origin:"*"
    }
))
app.use(morgan("common"))


app.use("/images",express.static(path.join(__dirname,"public/images")))
app.use("/avatar",express.static(path.join(__dirname,"public/avatar")))
// console.log(express.static(path.join(__dirname,"public\\images")))

// console.log(`${__dirname}public\\images`)
//把用户上传的图片存到我的服务器上

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        // windo 和 linux 斜杠不一样
        cb(null,`${__dirname}/public/images`)
        
    },
    filename:(req,file,cb)=>{
        // const iname=`${Date.now()}-${file.originalname}`;
        cb(null,file.originalname);

    }
})
const upload=multer({storage:storage})
app.post("/api/upload",upload.single("file"),(req,res)=>{
    try{
        console.log(req.file)
        console.log(typeof(req.body.name))


        return res.status(200).json("file uploaded success");
    }catch(err){
        console.log(err);
    }
})

const storageA=multer.diskStorage({
    destination:(req,file,cb)=>{
        // windo 和 linux 斜杠不一样
        cb(null,`${__dirname}/public/avatar`)
        
    },
    filename:(req,file,cb)=>{
        // const iname=`${Date.now()}-${file.originalname}`;
        cb(null,file.originalname);

    }
})

// ava
const uploadA=multer({storage:storageA})


app.post("/api/uploadAvatar",uploadA.single("file"),(req,res)=>{
    try{
        console.log(req.file)
        console.log(typeof(req.body.name))


        return res.status(200).json("file uploaded success");
    }catch(err){
        console.log(err);
    }
})  

app.use("/api/users",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/posts",postRoute)
app.use("/api/conversations",conversationsRoute)
app.use("/api/messages",messageRoute)
// app.use("/api/profile",profileRoute)
app.use('/api/group',groupRoute)

app.get("/",(req:Request,res:Response)=>{
    res.send("welcome to homepage")
})


app.get("/users",(req,res)=>{
    res.send("welcome to userpage")
})

app.listen(8800,()=>{
    console.log("backend is ready");
})