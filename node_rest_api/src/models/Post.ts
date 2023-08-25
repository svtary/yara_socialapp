import { model,Schema,Types } from "mongoose";

interface IPost{
    userId:string,
    desc:string,
    img:string,
    likes:Types.Array<number>,

    

}
const PostSchema=new Schema({
    userId:{
        type:String,
        required:true
    },
    desc:{
        type:String
    },
    img:{
        type:String
    },
    likes:{
        type:Array,
        default:[]
    },

  

},  {timestamps:true});

export default model<IPost>("Post",PostSchema)