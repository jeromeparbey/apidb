import { ForgotPasswordDTO } from "../dto/ForgotPasswordDTO"
import { IAuthRepository } from "../../domain/repositories/IAuthRepository"
import { NodeMailerService } from "@/providers/Mail/NodeMailerService"
import { redisClient } from "@/lib/redis"
import { ConsoleLogger } from "@/providers/Logger/infrastructure/ConsoleLogger"
import { AuthValidator } from "../validator/AuthValidator"
import { OtpService } from "@/providers/OtpProvider/OtpService"

export class ForgotPasswordUseCase {

  constructor(
    private repository: IAuthRepository,
    private mailService: NodeMailerService,
    private otpService: OtpService,
    private logger: ConsoleLogger
  ) {}

  async execute(dto: ForgotPasswordDTO): Promise<{ message: string }> {

    AuthValidator.validateForgotPassword(dto)

    const email = dto.email.toLowerCase().trim()

    // vérifier si l'utilisateur existe
    const user = await this.repository.findUserByEmail(email)

    if (!user) {

      this.logger.warn(
        "Tentative de reset password pour email inexistant",
        { email }
      )
     // return pour ne pas montrer de faille aux attaquand 
      return {
        message: "Si l'email existe, un code OTP a été envoyé"
      }

    }

    // génération OTP
    const otp = this.otpService.generateOtp()

    // expiration
    const expires = this.otpService.getExpirationDate()

    // sauvegarder OTP en DB
    await this.repository.createResetPassword(
      user.id,
      otp,
      expires
    )

    // stocker dans redis
    await redisClient.set(
      `reset:otp:${user.id}`,
      otp,
      "EX",
      300
    )

    // envoyer email
    await this.mailService.sendResetPassword(
      user.email,
      otp
    )

    this.logger.info(
      "OTP reset password envoyé",
      { userId: user.id }
    )

    return {
      message: "Si l'email existe, un code OTP a été envoyé"
    }

  }

}
