import z from 'zod'

export const acceptMessageSchema = z.object({
   
    password: z.boolean()
})