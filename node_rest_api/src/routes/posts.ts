import {Router} from "express";

import User from "../models/User";
import Post from "../models/Post";

const postRoute:Router=Router();


//creata a post
postRoute.post("/",async(req,res)=>{
    const newPost=new Post(req.body);
    try{
        const savepost=await newPost.save();
        res.status(200).json(savepost);

    }catch(err){
        res.status(500).json(err);
    }
})
//update a post
postRoute.put("/:id",async(req,res)=>{
    try{
        const post:any=await Post.findById(req.params.id);
        if(post.userId===req.body.userId){
            await post?.updateOne({$set:req.body});
            res.status(200).json("post updated");
    }else{
        res.status(403).json("you can only update your own post");
    }
    
    }catch(err){
        res.status(500).json(err);
    }
})
//delete a post
postRoute.delete("/:id",async(req,res)=>{
    try{
        const post:any=await Post.findById(req.params.id);
        if(post.userId===req.body.userId){
            await post?.deleteOne({$set:req.body});
            res.status(200).json("post delete");
    }else{
        res.status(403).json("you can only delete your own post");
    }
    
    }catch(err){
        res.status(500).json(err);
    }
})

//like /dislike a post
postRoute.put("/:id/like",async(req,res)=>{
    try{
        const post:any=await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post?.updateOne({$push:{likes:req.body}});
            res.status(200).json("post like");
    }else{
        await post.updateOne({$pull:{likes:req.body.userId}})
        res.status(200).json("the post has been disliked")
    }
    
    }catch(err){
        res.status(500).json(err);
    }
})

//get a post
postRoute.get("/:id",async(req,res)=>{
    try{
        const post:any=await Post.findById(req.params.id);
        res.status(200).json(post);
    
    }catch(err){
        res.status(500).json(err);
    }
})

//get timeline a post
postRoute.get("/timeline/:userId",async(req,res)=>{
    let postarr=[];
    try{
        const currentUser:any=await User.findById(req.params.userId);
        const userPosts=await Post.find({userId:currentUser._id});
        const friendsPosts=await Promise.all(
            currentUser.followings.map((friendId:string)=>{
                return Post.find({userId:friendId});
            })
        )
        res.status(200).json(userPosts.concat(...friendsPosts));
    
    }catch(err){
        res.status(500).json(err);
    }
})

//get user's all post
postRoute.get("/profile/:username",async(req,res)=>{
    let postarr=[];
    try{
        const user=await User.findOne({username:req.params.username});
        console.log(user);
        const posts=await Post.find({userId:user?._id});;
        res.status(200).json(posts)
    
    }catch(err){
        res.status(500).json(err);
    }
})

export default postRoute;