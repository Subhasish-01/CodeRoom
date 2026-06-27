import mongoose, {model,Schema} from "mongoose";



const RoomSchema = new Schema({
    roomId:{type:String,unique:true,required:true},
    owner:{type:Schema.Types.ObjectId,ref:"User"},
    code:{
        type:String,
        default:"// Start coding..."
    },
    language:{type:String,default:"cpp"}

},{
    timestamps:true
})
export const RoomModel = model("Room",RoomSchema);