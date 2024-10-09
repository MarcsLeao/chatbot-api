import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/userController.js";

export async function userRouter(app: FastifyInstance) {
    const user = new UserController()

    app.get('/api/user', user.findMany)
    app.post('/api/user/create', user.create)
    app.post('/api/user/auth', user.auth)
    app.post('/api/user/password/reset', user.email)
    app.patch('/api/user/password/reset/confirm', user.updatePassword)
}