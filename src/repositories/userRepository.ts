import { PrismaClient } from "@prisma/client";
import { UserData } from "../interfaces/userInterfaces.js";
import { hashPassword } from "../utils/bcrypt.js";
import { formatUserData } from "../utils/formatFunctions.js";
import { v4 as uuidv4 } from 'uuid';

export class UserRepository {
    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }

    async findMany() {
        try {
            const users = await this.prisma.users.findMany({
                select: {
                    name: true, 
                    gender: true, 
                    birth_date: true,
                    created_at: true,
                    login: {select: { email: true, password: true }}
                  }
            })

            return users
        } catch (error) {
            console.log(error)
            throw new Error("Can't find the users.")
        }
    }

    async create({name, gender, birth_date, phone, email, password}: UserData) {
        try {
            const existingUser = await this.prisma.login.findUnique({
                where: { email }
            })
    
            if (existingUser)
                throw new Error("Email address is already in use.")

            birth_date = new Date(birth_date).toISOString()        
            password = await hashPassword(password)

            const newUser = await this.prisma.users.create({
                data: { uuid: uuidv4(), name, gender, birth_date, phone }
            })
    
            const newLogin = await this.prisma.login.create({
                data: { id_users: newUser.id, email, password }
            })

            const userData = formatUserData(newUser, newLogin)

            return userData
        } catch (error) {
            console.log(error)
            throw new Error("Unable to create a new user.")
        }
    }


    async emailExists(email: string) {
        try {
            const userEmail = await this.prisma.login.findUnique({
                where: { email }
            })

            return userEmail !== null
        } catch (error) {
            console.log(error);
            throw new Error("Unable to check if the email exists.");
        }
    }

    
    async phoneExists(phone: string) {
        try {
            const userPhone = await this.prisma.users.findUnique({
                where: { phone }
            })

            return userPhone !== null
        } catch (error) {
            console.log(error)
            throw new Error("Unable to check if the phone number exists.");
        }
    }

    async findByEmail(email: string) {
        try {
            const user = await this.prisma.login.findFirst({
                    where: { email }, 
                    include: { users: true }
                })

            return user
        } catch (error) {
            console.log(error)
            throw new Error("Unable to find the user email.")
        }
    }
    
    async findByEmailAndSetPasswordToken(email: string, token: string, tokenExpirationDate: Date) {
        try {
            const setPasswordToken = await this.prisma.login.update({
                where: { email },
                data: { tokenResetPassword: token, tokenResetPasswordExpiresAt: tokenExpirationDate }
            })

            const getPublicID = await this.prisma.users.findUnique({
                where: { id: setPasswordToken.id_users }
            })

            if(!getPublicID)
                throw new Error("Failed to obtain the UUID.")

            return { ...setPasswordToken, uuid: getPublicID!.uuid }
        } catch (error) {
            console.log(error)
            throw new Error("Unable to set the password reset token.")
        }
    }
    
    async updatePassword(uuid: string, tokenResetPassword: string, password: string) {
        try {
            password = await hashPassword(password)

            const userPublicID = (await this.prisma.users.findUnique({ where: { uuid } }))!.id
            if(!userPublicID)
                throw new Error("The user UUID does not exist.")

            const userLoginInfo = await this.prisma.login.findUnique({
                where: { id: userPublicID }  
            })

            if(userLoginInfo!.tokenResetPassword !== tokenResetPassword)
                throw new Error("The token does not match.")

            if(userLoginInfo!.tokenResetPasswordExpiresAt! < new Date())
                throw new Error("The token has expired.")

            const updatedLogin = await this.prisma.login.update({
                where: { id_users: userPublicID },
                data: { password }
            })

            const clearPasswordToken = await this.prisma.login.update({
                where: { id: userPublicID },
                data: { tokenResetPassword: null },
            })

            if(!clearPasswordToken)
                throw new Error("Failed to clear the password token.")

            return updatedLogin
        } catch (error) {
            console.log(error)
            throw new Error("Unable to update the user password.")
        }   
    }
}