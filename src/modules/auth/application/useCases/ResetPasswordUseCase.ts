import { ResetPasswordDTO } from "../dto/ResetPasswordDTO"
import { IAuthRepository } from "../../domain/repositories/IAuthRepository"
import { IHashProvider } from "@/providers/HashProvider/domain/IHashProvider"
import { ConsoleLogger } from "@/providers/Logger/infrastructure/ConsoleLogger"
import { AuthValidator } from "../validator/AuthValidator"
import { redisClient } from "@/lib/redis"

export class ResetPasswordUseCase {

  constructor(
    private repository: IAuthRepository,
    private hashProvider: IHashProvider,
    private logger: ConsoleLogger
  ) {}

  async execute(dto: ResetPasswordDTO): Promise<{ message: string }> {

    AuthValidator.validateResetPassword(dto)

    // chercher OTP dans la DB
    const reset = await this.repository.findResetPasswordByOtp(dto.otp)

    if (!reset) {
      throw new Error("OTP invalide")
    }

    if (reset.expiresAt < new Date()) {
      throw new Error("OTP expiré")
    }

    // hash nouveau mot de passe
    const hashedPassword = await this.hashProvider.hash(dto.password)

    // update mot de passe de l'utilisateur lié à l'OTP
    await this.repository.updateUserPassword(reset.userId, hashedPassword)

    // marquer OTP utilisé
    await this.repository.markResetPasswordUsed(reset.id)

    // supprimer redis
    await redisClient.del(`reset:otp:${reset.userId}`)

    this.logger.info("Mot de passe réinitialisé", {
      userId: reset.userId
    })

    return { message: "Mot de passe réinitialisé avec succès" }
  }

}
