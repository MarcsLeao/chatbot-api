import Fastify from 'fastify'
import { userRouter } from './routes/userRoutes.js'
import { chatRouter } from './routes/chatRoutes.js'

const port = Number(process.env.PORT)
const app = Fastify()

app.register(userRouter)
app.register(chatRouter)

app.listen({ port }, (error) => {
    if(error) {
        console.log(error)
        process.exit(1)
    }

    console.log(`Server started on http://localhost:${port}`)
})