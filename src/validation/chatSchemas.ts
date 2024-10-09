import { z } from 'zod'

export const chatSchema = z.object({
    sessionId: z.string().min(1).max(100),
    text: z.string().min(1).max(100)
})