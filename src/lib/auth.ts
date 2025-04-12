import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import { db } from "./db";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60, // Update session every 1 hour
    },
    pages: {
        signIn: '/auth/login'
    },
    providers: [
        CredentialsProvider({

          name: "Credentials",

          credentials: {
            email: { label: "Email", type: "email", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials) {
            if(!credentials?.email || !credentials?.password)
            {
                return null
            }
            const existingUser = await db.user.findUnique({
                where: {email: credentials.email}
            })
            if(!existingUser)
            {
                return null;
            }

            const passwordMatch = await compare(credentials.password, existingUser.password)
            if(!passwordMatch)
            {
                return null;
            }
            return {
                id: existingUser.id,
                username: existingUser.username,
                email: existingUser.email
            }
          }
        })
    ],
    callbacks: {
        async jwt({token, user}){
            if(user){
                return{
                    ...token,
                    username: user.username,
                    id: user.id
                }
            }
            return token
        },
        async session({session,token}){
            return {
                ...session,
                user: {
                    ...session.user,
                    username: token.username,
                    id: token.id
                }
            }
        }
    }
}