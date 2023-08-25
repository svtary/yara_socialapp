import { model,Schema,Types } from "mongoose";

interface IMessage{
    conversationId:string,
    sender:string,
    text:string,
    isMedia:boolean,
    buffer:Buffer
}
const MessageSchema=new Schema({
    conversationId:{
        type:String,
    },
    sender:{
        type:String
    },
    text:{
        type:String
    },
    isMedia:{
        type:Boolean,
        default:false
    },
    buffer:{
        type:Buffer,
        default:null
    }

  

},  {timestamps:true});

export default model<IMessage>("Message",MessageSchema)