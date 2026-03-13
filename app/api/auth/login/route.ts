import { NextRequest } from "next/server"
import { AuthController } from "@/modules/auth/infrastructure/AuthController"

export async function POST(req: NextRequest) {
  return AuthController.login(req)
}
