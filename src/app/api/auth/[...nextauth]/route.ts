import NextAuth from "next-auth";
import { authOptions } from "../options";

//always fucntion should be named as handler 
const handler = NextAuth(authOptions)

export {handler as GET ,handler as POST}