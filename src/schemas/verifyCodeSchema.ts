import z from 'zod'

export const verifyCodeSchema = z.object({
    code :z.string().length(6,{message:"Verifcation code must be of 6 digit"})
})
