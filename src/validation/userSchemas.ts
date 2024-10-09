import z from "zod";

export const createUserSchema = z.object({
    name: z.string().min(3).max(100), 
    gender: z.enum(['M', 'F']), 
    birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    phone: z.string().length(11), 
    email: z.string().email().min(6), 
    password: z.string().min(8).max(254)
})

export const userLoginSchema = z.object({
    email: z.string().email().min(6), 
    password: z.string().min(8).max(254)
})

export const userPasswordSchema = z.object({
    password: z.string().min(8).max(254)
})

export const userEmailSchema = z.object({
    email: z.string().email().min(6)
})