import { model,Schema,Types } from "mongoose";

interface IUser{
    username:string,
    email:string,
    password:string,
    profilePicrure:string,
    coverPicture:string,
    followers:Types.Array<number>,
    followings:Types.Array<number>,
    isAdmin:boolean,
    desc:string,
    city:string,
    from:string,
    relationship:number,
    token:string,
    otp:string,
    otp_expirt_time:Date,
    

}
const UserSchema=new Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilePicrure:{
        type:String,
        default:""
    },
    coverPicture:{
        type:String,
        default:"",
        
    },
    followers:{
        type:Array,
        default:[]
    },
    followings:{
        type:Array,
        default:[]
    },
    isAdmin:{
        type:Boolean,
        default:false,

    },
    desc:{
        type:String,
        
    },
    city:{
        type:String,

    },
    from:{
        type:String
    },
    relationship:{
        type:Number,
        enum:[1,2,3],
        
    },
    token:{
        type:String,

    },
    otp:{
        type:String,
    },
    otp_expiry_time:{
        type:Date,
    }
  

},  {timestamps:true});
// const User=model<IUser>("User",UserSchema)
export default model<IUser>("User",UserSchema)