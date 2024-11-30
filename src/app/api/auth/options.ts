import type {NextAuthOptions} from 'next-auth'; 


import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";


export const authOptions : NextAuthOptions={
    providers:[
        CredentialsProvider({
            id: "Credentials",
            name: "Credentials",
            //here it is creating an html form for me just like in oauth we use google button
            credentials:{
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials:any, req:any) :Promise<any>{
                await dbConnect();
                try{
                   const user =  await UserModel.findOne({
                        $or: [
                            //used user to make it future proof 
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })
                    //user not found --> Do not Move forward
                    if(!user){
                        throw new Error("No user found with these credentials.");
                    }
                    //user is not verfied --> Do not Move forward
                    if(!user.isVerified){
                        throw new Error("Please verify you account before login.");
                    }
                    const isPasswordCorrect= await bcrypt.compare(credentials.password,user.password);
                    if(isPasswordCorrect)
                        return user;
                    else
                        throw new Error("Invalid Credentials")

                }catch(err:any){
                    throw new Error(err)
                }
            }
        })
    ],

    callbacks:{
        async session({session,token}:any) {
            if(token){
                session.user._id = token._id?.toString(),
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;
                session.user.isVerified = token.isVerified
            }
            return session
          },
          
          async jwt({token,user}:any) {
            if(user){
                token._id = user._id?.toString(),
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
                token.isVerified = user.isVerified
            }
            return token
          }
    },

    pages:{
        signIn:'/sign-in'
    },

    session:{
        strategy:"jwt"
    },

    secret:process.env.NEXT_AUTH_SECRET
}