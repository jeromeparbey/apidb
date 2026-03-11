
import { NextResponse } from "next/server"
import { ConsoleLogger } from "@/providers/Logger/infrastructure/ConsoleLogger"
import { ResponseProvider } from "@/providers/Response/infrastructure/ResponseProvider"

const logger = new ConsoleLogger()

export function errorMiddleware(error: any) {

  logger.error("erreur dans le middleware", error)

  if (error?.message) {

    const response = ResponseProvider(
      400,
      error.message
    )

    return NextResponse.json(response, { status: 400 })

  }

  const response = ResponseProvider(
    500 , 
    "Erreur interne du serveur"
  ) ; 

    return NextResponse.json(response, { status: 500 })

}
