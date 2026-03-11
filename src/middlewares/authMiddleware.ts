
import { NextRequest, NextResponse } from "next/server"
import { JwtProvider } from "@/providers/JwtProvider/infrastructure/JwtProvider"
import { ResponseProvider } from "@/providers/Response/infrastructure/ResponseProvider"
import { ConsoleLogger } from "@/providers/Logger/infrastructure/ConsoleLogger"

const jwtProvider = new JwtProvider()
const logger = new ConsoleLogger()

export async function authMiddleware(req: NextRequest) {

  try {

    const authHeader = req.headers.get("authorization")

    if (!authHeader) {

      const response = ResponseProvider(
        401,
        "header authorization is required"
      )

      return NextResponse.json(response, { status: 401 })

    }

    const token = authHeader.split(" ")[1]

    if (!token) {

      const response = ResponseProvider(
        401,
        "format de token invalide"
      )

      return NextResponse.json(response, { status: 401 })

    }

    const payload = await jwtProvider.verify(token) ; 

    (req as any).user = payload

    return null

  } catch (error: any) {

    logger.error("erreur lors de la verification du token", error)

    const response = ResponseProvider(
      401,
      "Token expirer ou invalide "
    )

    return NextResponse.json(response, { status: 401 })

  }

}
