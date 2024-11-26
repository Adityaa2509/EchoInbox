import mongoose, { mongo } from "mongoose";
import { Schema,Document } from "mongoose";

//Document for type Safety

//Design interface for type safety of message schema
//Document documents the interface in mongoose
export interface Message extends Document{
    content: string;
    createdAt:Date
}

//using the above type safety schema here
//here it automatically checks through linting for type safety
//if you type number it gives you error
const messageSchema:Schema<Message> = new Schema({
    content:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    }
})

//Design interface for type safety of user schema
//Document documents the interface in mongoose
export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages:Message[];
}
//database schema of user
const userSchema:Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        trim:true,
        unique:true,
        //to check email pattern
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,'Please use a valid email address']
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        trim:true,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verifyCode:{
        type:String,
        required:[true,"VerifyCode is required"],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"VerifyCode is required"],
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    messages:[messageSchema]
})

//HOW TO EXPort
//in next.js most things run on edge
//yaha ek baar chalo hoke ek baar band nahi hota bcoz it run on edge
//if appn is booting up first time or not


//check if it is already present or not
// return data type is as mongoose.Model<User> just type safety

const UserModel = (mongoose.models.User as mongoose.Model<User>) || 
                  (mongoose.model<User>("User",userSchema))

export default UserModel;                  