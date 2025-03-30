import { NextResponse } from "next/server"
import {db} from "@/lib/db"
import { hash } from "bcryptjs"
import { z } from "zod";

const userSchema = z
  .object({
    username: z.string().min(4, { message: "Username is required" }).max(20, {
      message: "Username must be less than 20 characters",
    }),
    email: z.string().min(1, { message: "Email is required" }).email({
      message: "Invalid email address",
    }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, {
      message: "Please confirm your password",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function POST(req: Request){
    try{
        const body = await req.json()
        const { email, username, password} = userSchema.parse(body) 

        const existingUserByEmail = await db.user.findUnique({
            where: {email: email},
        })

        const existingUserByUsername = await db.user.findUnique({
            where: {username: username},
        })

        if(existingUserByEmail)
        {
            return NextResponse.json({
                user: null,
                message: "User with this email already exists",
                status: 409
            })
        }

        if(existingUserByUsername)
        {
            return NextResponse.json({
                user: null,
                message: "User with this username already exists",
                status: 409
            })
        }

        const hashedPassword = await hash(password,10)

        const newUser = await db.user.create({
            data:{
                username,
                email,
                password: hashedPassword
            }
        })


        return NextResponse.json(
        {
            message: "created successfuly",
        },
        {
            status: 201
        }
        )
    }catch(error){
        return NextResponse.json(
        {
            message: "something went wrong"
        },
        {
            status: 500
        }
        )
    }
}

export async function GET(){
    const user = await db.user.findMany()

    return NextResponse.json({
        "success": "got it!",
        "user": user
    })
}