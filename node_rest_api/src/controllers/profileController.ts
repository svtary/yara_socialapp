
import User from "../models/User";
import Post from "../models/Post";
// 实际上没用
const getProfile=async(req:any,res:any):Promise<void>=>{
    let postarr=[];
    try{
        const currentUser:any=await User.findById(req.params.userId);
        const userPosts=await Post.find({userId:currentUser._id});
       
        res.status(200).json(userPosts);
    
    }catch(err){
        res.status(500).json(err);
    }
}
export default {getProfile};