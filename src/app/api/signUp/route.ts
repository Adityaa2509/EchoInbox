import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest } from "next/server";
import otpGenerator from 'otp-generator'
export async function POST(req:NextRequest){
    await dbConnect()
    try{
        const reqBody = await req.json();
        const {username,email,password} = reqBody;
        
       const existingUserVerifiedByUsername =  await UserModel.findOne({username,isVerified:true})
        
       //if existing user verified by username exists then no worry return failed
       if(existingUserVerifiedByUsername){
        return Response.json({
            success:false,
            message:"Username Already registerd and verified",
            status:400
        })
       }

       const userExistsWithEmail = await UserModel.findOne(email);
       const verifyCode = otpGenerator.generate(6, { lowerCaseAlphabets:false,upperCaseAlphabets: false, specialChars: false });
       const nUser = {};
       if(userExistsWithEmail){
        //Create a freah user and delte previous
            if(userExistsWithEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"Email Already registerd and verified",
                    status:400
                }) 
            }else{
                let hashedPassword = "";
            try{
                hashedPassword = await bcrypt.hash(password,10);}catch(err){
                    return Response.json({
                        success:false,
                        message:"Error while hashing password",
                        status:400
                    })
                }
            //update the user with password and verifycODE AND VERIFYCODE EXPIRY and save it.
                userExistsWithEmail.password = hashedPassword;
                userExistsWithEmail.verifyCode = verifyCode;
                userExistsWithEmail.verifyCodeExpiry = new Date(Date.now()+360000);
                await userExistsWithEmail.save();

            }

       }else{
        //uSER COMES FIRST TIME MAKE IT AND SAVE IT

            //HASH THE PASSWORD
            let hashedPassword = "";
            try{
                hashedPassword = await bcrypt.hash(password,10);}catch(err){
                    return Response.json({
                        success:false,
                        message:"Error while hashing password",
                        status:400
                    })
                }
            //Set expiry date as 1 hour    
            const expiryDate= new Date();
            expiryDate.setHours(expiryDate.getHours()+1);  
            //create new user  
            const nUser = await UserModel.create({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isAcceptingMessage:true,
                messages:[]
            })
       }
       const emailResponse = await sendVerificationEmail(email,username,verifyCode);
       
       //email not send succesfuly
       if(!emailResponse.success){
        return Response.json({
            success:false,
            message:"Error Sending Email,Try Again",
            status:400
        })
       }
       //email send successfully
        return Response.json({
        success:false,
        message:"User Registered Succesfully",
        status:200,
        data:nUser
    })
    }catch(err){
        console.log(err);
        return Response.json({
            success:false,
            message:"Error Registering user",
            status:500
        })
    }
}
