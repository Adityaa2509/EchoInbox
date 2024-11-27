import { apiResponse } from "@/types/apiResponse";
import VerificationEmail from "../../emails/verificationEmail";
import { resend } from "../lib/resend";

export async function sendVerificationEmail(
  email:string,
  username:string,
  verifyCode:string
) :Promise<apiResponse>{
    try {
      const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'EchoInbox | Verification Code',
        react: VerificationEmail ({username,otp:verifyCode}),
      });
  
      if (error) {
        return {success:false,message:'Failed to send verification email',status:400}
      }
  
      return {success:true,message:'Email Send Successfully',status:200}
    } catch (error) {
      console.log(error)
      return {success:false,message:'Failed to send verification email',status:500}
    }
  }