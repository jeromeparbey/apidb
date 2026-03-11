import { LoginDTO } from "../dto/LoginDTO"
import { IAuthRepository } from "../../domain/repositories/IAuthRepository"
import { IHashProvider } from "@/providers/HashProvider/domain/IHashProvider"
import { IJwtProvider } from "@/providers/JwtProvider/domain/IJwtProvider"
import { ConsoleLogger } from "@/providers/Logger/infrastructure/ConsoleLogger"
import { OtpService } from "@/providers/OtpProvider/OtpService"
import { NodeMailerService } from "@/providers/Mail/NodeMailerService"
import { AuthToken } from "../../domain/entities/AuthToken"
import { redisClient } from "@/lib/redis"
import { AuthValidator } from "../validator/AuthValidator"

export class LoginUseCase {

  constructor(
    private repository: IAuthRepository,
    private hashProvider: IHashProvider,
    private jwtProvider: IJwtProvider,
    private otpService: OtpService,
    private mailService: NodeMailerService,
    private logger: ConsoleLogger
  ) {}

  async execute(dto: LoginDTO) : Promise<AuthToken | { twoFactorRequired: boolean, message: string }>{
      
     AuthValidator.validateLogin(dto)

    const cachedOtp = await redisClient.get(`login:otp:${dto.email}`)

    if (cachedOtp) {
      return {
        twoFactorRequired: true,
        message: "Otp requis pour la connexion"
      }
    }

    const user = await this.repository.findUserByEmail(dto.email)

    if (!user) {
      throw new Error("Email inconnu")
    }

    const passwordMatch = await this.hashProvider.compare(
      dto.password,
      user.password
    )

    if (!passwordMatch) {
      throw new Error("Mot de passe incorrect")
    }

    // ADMIN double authentification obligatoire

    if (user.role === "ADMIN") {

      const otp = this.otpService.generateOtp()
      const expires = this.otpService.getExpirationDate()

      await this.repository.createOtp(
        user.id,
        otp,
        expires
      )

      await this.mailService.sendOtp(
        user.email,
        otp
      )

      await redisClient.set(
        `login:otp:${user.id}`,
        otp,
        "EX",
        300
      )

      this.logger.info("OTP à l'admin pour la connexion", { userId: user.id })

      return {
        twoFactorRequired: true,
        message: "Otp requis pour la connexion"
      }

    }

    const token = await this.jwtProvider.sign({
      id: user.id,
      email: user.email,
      role: user.role
    })

    await redisClient.set(
      `session:${user.id}`,
      token,
      "EX",
      3600
    )

    this.logger.info("Utilisateur connecté", { userId: user.id })

    return new AuthToken(token, "1h")

  }

}
