import bcrypt from 'bcryptjs';
import User from "../models/User";

const updateuser=async(req:any,res:any)=>{

    console.log(req.body);
    if(req.body.userId===req.params.id||req.body.isAdmin){
        if(req.body.password){
            try{
                const salt=await bcrypt.genSalt(10);
                req.body.password=await bcrypt.hash(req.body.password,salt);

            } catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const user=await User.findByIdAndUpdate(req.params.id,{$set:req.body});
            res.status(200).json("Updateds");
        }catch(err){
            return res.status(500).json(err);
        }
        

    }else{
        return res.status(403).json("you can update only you account")
    }

}
const updateinfo=async(req:any,res:any)=>{

     try{
        await User.findByIdAndUpdate(req.body.id,{
            username:req.body.username,
            profilePicrure:req.body.profilePicrure,
            desc:req.body.desc,
            relationship:req.body.relationship,
            city:req.body.city
        },{new:true,
        validateModifiedOnly:true});

        const user=await User.findById(req.body.id);
         res.status(200).json(user)
 
         return;
     }catch(err){
         res.status(500).json(err);
     }

}

const deleteuser=async(req:any,res:any)=>{
    console.log(req.body);
    // req.body.user.isAdmin后面要改
    if(req.body.userId===req.params.id||req.body.isAdmin){
        
        try{
            const user=await User.findByIdAndDelete({_id:req.params.id});
            res.status(200).json("delete success");
        }catch(err){
            return res.status(500).json(err);
        }
        

    }else{
        return res.status(403).json("you can delete only you account");
    }

}
const getalluser=async(req:any,res:any)=>{
    const filter={};
    // console.log("in get user",req.query)
    try{
        const allusers=await User.find(filter);
        console.log("allu",allusers)
        res.status(200).json(allusers)
        return
    }catch(err){
        return res.status(500).json(err);
    }
}

const getuser=async(req:any,res:any)=>{
    const userId=req.query.userId;
    const username=req.query.username;
    // console.log("in get user",req.query)
    try{
        const user:any= userId? await User.findById(userId):await User.findOne({username:username});
        const {password,updateAt,...others}=user._doc;
        // console.log("user in get",others);
        res.status(200).json(others);
        
    }catch(err){
        return res.status(500).json(err);
    }
}
const getfriends=async(req:any,res:any)=>{
    try{
        const user=await User.findById(req.params.userId);
        let Allu:any=user?.followings.map(friendId=>{
            return User.findById(friendId)
        })
        const friends=await Promise.all(Allu) 
        let friendList:any=[];
        friends.map(friend=>{
            const {_id,username,profilePicrure }=friend;
            friendList.push({_id,username,profilePicrure})
        });
        res.status(200).json(friendList)
        
     }catch(err){
        res.status(500).json(err);
    }
}

const followuser=async(req:any,res:any)=>{
    if(req.body.userId!==req.params.id){
        try{
            const user:any=await User.findById(req.params.id);
            const currentUser:any=await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}});
                await currentUser.updateOne({$push:{followings:req.params.id}});
                res.status(200).json(user);
            }else{
                res.status(403).json("you allready followe");
            }
        
           
            
        }catch(err){
            return res.status(500).json(err);
        }

    }else{
        res.status(403).json("you canot folow yousefl");
    }

}

const unfollouser=async(req:any,res:any)=>{
    if(req.body.userId!==req.params.id){
        try{
            const user:any=await User.findById(req.params.id);
            const currentUser:any=await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}});
                await currentUser.updateOne({$pull:{followings:req.params.id}});
                res.status(200).json(user);
            }else{
                res.status(403).json("you dont unfollowe");
            }
        
           
            
        }catch(err){
            return res.status(500).json(err);
        }

    }else{
        res.status(403).json("you canot unfolow yousefl");
    }

}
export default {updateuser,updateinfo,deleteuser,getuser,getfriends,followuser,unfollouser,getalluser}