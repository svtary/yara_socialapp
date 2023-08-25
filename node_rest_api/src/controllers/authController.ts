import {Router} from "express";
import User from "../models/User";
import bcrypt from 'bcryptjs';
import createtoken from "../middlewares/token.middleware";
import otpGenerator from "otp-generator"
import smtpTransport from "nodemailer-smtp-transport";
import  nodemailer from "nodemailer";
import jsonwebtoken from "jsonwebtoken";


const authRoute:Router=Router();

//register
const register=async (req:any,res:any,next:any)=>{

    // console.log("register",req.body);
    const{email}=req.body.email;
    const userExists=await User.findOne({email:req.body.email});
    // console.log("userExists",userExists)
    if(userExists){
        res.status(400).send("User already exists");
        return;
    }
    const salt=await bcrypt.genSalt(10);
    const hashPassword=await bcrypt.hash(req.body.password,salt);

    const newUser=new User({
        username:req.body.username,
        email:req.body.email,
        password:hashPassword
    });
    
    try{
        const user= await newUser.save();
        // console.log("register",user);
        

        // console.log("vrefu",req.userId);
        const new_otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            specialChars:false,
            lowerCaseAlphabets:false
        });
        const otp_expiry_time=Date.now()+10*60*1000;
        await User.findByIdAndUpdate(user._id,{
            otp_expiry_time:otp_expiry_time,
            otp:new_otp.toString()
        },{new:true,
        validateModifiedOnly:true});
        senEmail({
            from:"yara_yu@163.com",
            to:user?.email,
            subject:"Verication OTP",
            text: `your OPT verification is ${new_otp}`,
            attachments:[]
        });

        res.status(200).json(user)

        return;
    }catch(err){
        res.status(500).json(err);
    }
}

const verify=async (req:any,res:any): Promise<void>=>{
    try{
        console.log("vrinveridydyyy",req.body)
        const {email,otp}=req.body;
        const user=await User.findOne({email,otp_expiry_time:{$gt:Date.now()}});
        if(!user){
            return res.status(400).json("email isinvalidor OTP expired");
        }
        console.log(user.otp,otp)
        if(user.otp!==otp){
            res.status(400).json("OTP is not correct");
            return;
        }
        
        const token=jsonwebtoken.sign({data:user._id},"yarayu",{expiresIn:"24h"});
        // console.log("tolen",token);
        const newuser=await User.findByIdAndUpdate(user._id,{otp:undefined,token:token},{new:true,validateModifiedOnly:true}).select({otp:0,password:0})
        console.log("newniuser",newuser)
        res.status(200).json(newuser)

    }catch(err){
        res.status(500).json(err);
    }
    
}



//login
const login=async(req:any,res:any)=>{
    try{
        console.log("inlogin rquies",req.body)
        const user:any= await User.findOne({email:req.body.email});
        if(!user){
            res.status(404).send("user not found");
            return;
        }
        // !user&& res.status(404).send("user not found");
        // console.log(req.body.password,user.password);
        const validpassword=await bcrypt.compare(req.body.password,user?.password);
        // console.log(validpassword)
        if(!validpassword){
            res.status(404).send("wrong password");
            return;
        }
        // !validpassword&&res.status(404).send("wrong password");
        const token=jsonwebtoken.sign({data:user._id},"yarayu",{expiresIn:"24h"});
        const newuser=await User.findByIdAndUpdate(user._id,{otp:undefined,token:token},{new:true,validateModifiedOnly:true}).select({otp:0,password:0})
        console.log("newniuser",newuser)
        res.status(200).json(newuser)


    }catch(err){
        res.status(500).json(err);
    }
    

}

//mail

const senEmail=async({to,sender,subject,html,attachments,text}:any)=>{
    const transport=nodemailer.createTransport(
    smtpTransport({
        host:"smtp.163.com",
        port:465,
        secure:true,
        auth:{
            user:"yara_yu@163.com",
            pass:"ESNTNFLBVZNDYSVQ",
        }
    })
);

    try{
        const from="yara_yu@163.com";
        const msg={
            to:to,
            from:from,
            subject:subject,
            text:text,
            attachments
        };

        return transport.sendMail(msg);
        
    }catch(err){
        console.log(err);
    }

}


export default {login,register,verify};