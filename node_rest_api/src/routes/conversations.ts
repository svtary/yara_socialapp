import {Router} from "express";

import Conversation from "../models/Conversation";


const conversationsRoute:Router=Router(); 
//new conv
conversationsRoute.post("/",async (req,res)=>{
    const newConv=new Conversation({
        members:[req.body.senderId,req.body.receiverId],
    });
    try{
        const saveConv=await newConv.save();
        // console.log('savec',saveConv)
        res.status(200).json(saveConv)
    }catch(err){
        res.status(500).json(err)
    }
})
//get conv

conversationsRoute.get("/:userId",async(req,res)=>{
    try{
        // console.log("cwer",req.params.userId)
        const conv= await Conversation.find({
            members:{$in:[req.params.userId]}
        });
        // console.log("cobve",conv)
        res.status(200).json(conv)
    }catch(err){
        res.status(500).json(err)
    }
})



//get conv intcldes 2 userId
conversationsRoute.get("/find/:firstUserId/:secondUserId",async(req,res)=>{
    try{
        console.log('getn2',req.params.firstUserId,req.params.secondUserId)
        const conversation=await Conversation.findOne({
            members:{$all:[req.params.firstUserId,req.params.secondUserId]}
        })
        res.status(200).json(conversation)

    }catch(err){
        res.status(500).json(err)
    }
})

export default conversationsRoute;