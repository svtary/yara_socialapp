import { model,Schema,Types } from "mongoose";

interface IConversation{
    members:Types.Array<number>,

    

}
const ConversationSchema=new Schema({
    members:{
        type:Array,
    }

  

},  {timestamps:true});

export default model<IConversation>("Conversation", ConversationSchema)