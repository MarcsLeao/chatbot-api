import { FastifyInstance } from "fastify";
import { chatController } from "../controllers/chatController.js";

export async function chatRouter(app: FastifyInstance) {
    const chat = new chatController()

    app.post('/api/chat', chat.execute)
}