import { NextRequest, NextResponse } from "next/server"

import { PrismaAuthRepository } from "./PrismaAuthRepository"

import { LoginUseCase } from "../application/useCases/LoginUseCase"
import { RegisterUseCase } from "../application/useCases/RegisterUseCase"
import { ForgotPasswordUseCase } from "../application/useCases/ForgotPasswordUseCase"
import { VerifyOtpUseCase } from "../application/useCases/VerifyOtpUseCase"
import { ResetPasswordUseCase } from "../application/useCases/ResetPasswordUseCase"


import { BcryptHashProvider } from "@/providers/HashProvider/infrastructure/BcryptHashProvider"
import { JwtProvider } from "@/providers/JwtProvider/infrastructure/JwtProvider"
import { OtpService } from "@/providers/OtpProvider/OtpService"
import { NodeMailerService } from "@/providers/Mail/NodeMailerService"

import { ConsoleLogger } from "@/providers/Logger/infrastructure/ConsoleLogger"
import { ResponseProvider } from "@/providers/Response/infrastructure/ResponseProvider"

import { errorMiddleware } from "@/middlewares/errorMiddleware"

const repository = new PrismaAuthRepository()

const hashProvider = new BcryptHashProvider()
const jwtProvider = new JwtProvider()

const otpService = new OtpService()
const mailService = new NodeMailerService()

const logger = new ConsoleLogger()

export class AuthController {

  static async login(req: NextRequest) {

    try {

      const body = await req.json()

      const useCase = new LoginUseCase(
        repository,
        hashProvider,
        jwtProvider,
        otpService,
        mailService,
        logger
      )

      const result = await useCase.execute(body)

      const response = ResponseProvider(
        200,
        "Connexion réussie",
        result
      )

      return NextResponse.json(response)

    } catch (error) {

      return errorMiddleware(error)

    }

  }

  static async register(req: NextRequest) {

    try {

      const body = await req.json()

      const useCase = new RegisterUseCase(
        repository,
        hashProvider,
        logger
      )

      const result = await useCase.execute(body)

      const response = ResponseProvider(
        201,
        "Utilisateur créé",
        result
      )

      return NextResponse.json(response)

    } catch (error) {

      return errorMiddleware(error)

    }

  }

  static async forgotPassword(req: NextRequest) {

    try {

      const body = await req.json()

      const useCase = new ForgotPasswordUseCase(
        repository,
        mailService,
        otpService , 
        logger
      )

      const result = await useCase.execute(body)

      const response = ResponseProvider(
        200,
        "Email envoyé",
        result
      )

      return NextResponse.json(response)

    } catch (error) {

      return errorMiddleware(error)

    }

  }
 

static async resetPassword(req: NextRequest) {
  try {
    const body = await req.json()

    const useCase = new ResetPasswordUseCase(
      repository,
      hashProvider,
      logger
    )

    const result = await useCase.execute(body)
    
    const response = ResponseProvider(
      200,
      "Mot de passe réinitialisé avec succès",
      result
    )


    return NextResponse.json(response) ; 
    

  } catch (error) {
    return errorMiddleware(error)
  }
}



  static async verifyOtp(req: NextRequest) {

    try {

      const body = await req.json()

      const useCase = new VerifyOtpUseCase(
        repository,
        jwtProvider
      )

      const result = await useCase.execute(body)

      const response = ResponseProvider(
        200,
        "OTP vérifié",
        result
      )

      return NextResponse.json(response)

    } catch (error) {

      return errorMiddleware(error)

    }

  }

}
