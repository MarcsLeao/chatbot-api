import { FastifyReply, FastifyRequest } from "fastify";
import { chatSchema } from "../validation/chatSchemas.js";
import { ChatService } from "../services/chatService.js";

export class chatController{

    async execute(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { text, sessionId } = chatSchema.parse(request.body)
            if (!text) 
                return reply.code(400).send({message: "No user text found."});
            
            const Chat = new ChatService()
            const messages = await Chat.execute(text, sessionId)
            if(!messages)
                return reply.code(400).send({message: "chat connection failed."});

            return reply.send(messages)
        } catch (error) {
            console.log('Client request failed:', error);
            return reply.status(500).send({msg: '500 - Internal server error'});
        }
    }
}