import z from 'zod'

export const signUpSchema = z.object({
    username: z.string()
            .min(2,{message:"Username should be of atleast 2 characters"})
            .max(20,{message:"Username should be of atleast 2 characters"})
            .regex(/^[a-zA-z0-9_]+$/,{message:"Username must not contain special characters"}),

    email: z.string()
           .email({message:"Invalid email address"}),

    password: z.string()
              .min(6,{message:"Passwowrd must be atleast 6 charcaters"})
})