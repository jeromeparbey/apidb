import { NextRequest } from "next/server"
import { UserController } from "@/modules/users/infrastructure/UserController"

export async function POST(req : NextRequest){
    return UserController.create(req) ; 
}

