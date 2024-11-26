import z from 'zod'

export const messageSchema = z.object({

    content: z.string()
              .min(10,{message:"Message must be atleast of 10 charcaters"})
              .max(300,{message:"Message must be no longer than 300 charcaters"})
})