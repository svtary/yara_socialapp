import mongoose, { model,Schema,Types } from "mongoose";

interface IGroup{
    chatName:string,
    groupAdimin:mongoose.Schema.Types.ObjectId,
    users:mongoose.Schema.Types.ObjectId[],
    // latesetMessage:mongoose.Schema.Types.ObjectId
}
const GroupSchema=new Schema({
    chatName:{
        type:String,
        trim:true
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    // latesetMessage:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'Message'
    // }

  

},  {timestamps:true});

export default model<IGroup>("Group", GroupSchema)