import z from 'zod'

export const signInSchema = z.object({

    //identifier --> email,username
    identifier: z.string(),
    password: z.string()
              .min(6,{message:"Passwowrd must be atleast 6 charcaters"})
})