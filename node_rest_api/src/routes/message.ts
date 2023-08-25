import {Router} from "express";
import Message from "../models/Message";

const messageRoute:Router=Router(); 
//add
messageRoute.post("/",async(req,res)=>{
    const newMess=new Message(req.body);
    try{
        const saveMess=await newMess.save();
        res.status(200).json(saveMess);
    }catch(err){
        res.status(500).json(err)
    }
})
//get
messageRoute.get("/:conversationId",async(req,res)=>{
    try{
        const mess=await Message.find({
            conversationId:req.params.conversationId,
        });
        res.status(200).json(mess);
    }catch(err){
        res.status(500).json(err)
    }
})
export default messageRoute