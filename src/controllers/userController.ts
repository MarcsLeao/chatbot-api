import { FastifyReply, FastifyRequest } from "fastify";
import { UserRepository } from "../repositories/userRepository.js";
import { userLoginSchema, createUserSchema, userEmailSchema, userPasswordSchema } from "../validation/userSchemas.js";
import { comparePassword } from "../utils/bcrypt.js";
import { formatUserData } from "../utils/formatFunctions.js";
import { EmailService } from "../services/emailService.js";
import { nanoid } from "nanoid";

export class UserController {

    async findMany(request: FastifyRequest, reply: FastifyReply) {
        try {
            const User = new UserRepository()
            
            const users = await User.findMany()
            if(!users) return reply.code(400).send({ message: 'Failed to find users.' })

            return reply.send(users)
        } catch (error) {
            console.log(error)
            return reply.code(500).send({ message: "Can't find registered users in the database." })
        }
    }
    
    async create(request: FastifyRequest, reply: FastifyReply) {
        try {
            const data = createUserSchema.parse(request.body)
            
            const User = new UserRepository()

            const userEmailExists = await User.emailExists(data.email)
            if(userEmailExists)
                return reply.code(400).send({message: "The user email already exists"})

            const userPhoneExists = await User.phoneExists(data.phone)
            if(userPhoneExists)
                return reply.code(400).send({ message: "The user phone number already exists."})

            const newUser = await User.create(data)
            if(!newUser) 
                return reply.code(400).send({ message: "Unable to register a new user." })
            
            return reply.code(201).send(newUser)
        } catch (error) {
            console.log(error)
            return reply.code(500).send({ error: "Unable to register a new user." })
        }    
    }

    async auth(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { email, password } = userLoginSchema.parse(request.body)

            const User = new UserRepository()

            const findUserByEmail = await User.findByEmail(email)
            if(!findUserByEmail) 
                return reply.code(400).send({ message: "Cannot find the user email."})

            const isPasswordValid = await comparePassword(password, findUserByEmail.password)
            if(!isPasswordValid) 
                return reply.code(400).send({ message: "Password didn't match."})

            const userData = formatUserData(findUserByEmail!.users, findUserByEmail!)

            return reply.send(userData)
        } catch (error) {
            console.log(error)
            return reply.code(401).send({message: "Can't authenticate the user."})
        }
    }

    async email(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { email } = userEmailSchema.parse(request.body)
            const token = nanoid()
            const tokenExpirationDate = new Date(Date.now() + 2 * 60 * 60 * 1000)
            const User = new UserRepository()
            const Email = new EmailService()

            const findUserByEmail = await User.findByEmailAndSetPasswordToken(email, token, tokenExpirationDate)
            if(!findUserByEmail)
                return reply.code(400).send({ message: "Can't find the email for the user account." })

            await Email.sendPasswordResetEmail({ email, token, uuid: findUserByEmail.uuid })

            return reply.send({ trp: token, uuid: findUserByEmail.uuid })
        } catch (error) {
            console.log(error)
            return reply.code(400).send({message: "Verification of the email failed."})
        }
    }

    async updatePassword(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { password } = userPasswordSchema.parse(request.body)
            const { token, uuid } = request.query as { token: string, uuid: string }
            const User = new UserRepository()

            if(!token || !uuid) 
                return reply.code(400).send({ message: 'Query token data or public id is missing.' })

            const updateUserPassword = await User.updatePassword(uuid, token, password)
            if(!updateUserPassword)
                return reply.code(400).send({message: "Unable to update the user password due to missing arguments."})

            return reply.send(updateUserPassword)
        } catch (error) {
            console.log(error)
            return reply.code(400).send({message: "Unable to update the user password."})
        }
    }
}