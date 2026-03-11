import { VerifyOtpDTO } from "../dto/VerifyOtpDTO"
import { IAuthRepository } from "../../domain/repositories/IAuthRepository"
import { IJwtProvider } from "@/providers/JwtProvider/domain/IJwtProvider"
import { AuthToken } from "../../domain/entities/AuthToken"
import { redisClient } from "@/lib/redis"
import { AuthValidator } from "../validator/AuthValidator"

export class VerifyOtpUseCase {

  constructor(
    private repository: IAuthRepository,
    private jwtProvider: IJwtProvider
  ) {}

  async execute(dto: VerifyOtpDTO): Promise<AuthToken> {
        AuthValidator.validateVerifyOtp(dto)

    const user = await this.repository.findUserByEmail(dto.email)

    if (!user) {
      throw new Error("Utilisateur introuvable")
    }

    const cachedOtp = await redisClient.get(`login:otp:${user.id}`)

    if (!cachedOtp || cachedOtp !== dto.code) {
      throw new Error("Otp invalide")
    }

    const otp = await this.repository.findOtp(
      dto.email,
      dto.code
    )

    if (!otp) {
      throw new Error("OTP introuvable")
    }

    if (otp.expiresAt < new Date()) {
      throw new Error("Otp expiré")
    }

    await this.repository.markOtpUsed(otp.id)

    const token = await this.jwtProvider.sign({
      id: user.id,
      email: user.email,
      role: user.role
    })

    await redisClient.del(`login:otp:${user.id}`)

    return new AuthToken(token, "1h")

  }

}
