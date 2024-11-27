 import { Message } from "@/models/User";
export interface apiResponse{
    success:boolean;
    message:string;
    status:number;
    isAcceptingMessages?:boolean;
    messages?:Array<Message>
}

//For API response type safety
