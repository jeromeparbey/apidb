import { RegisterDTO } from "../dto/RegisterDTO"
import { IAuthRepository } from "../../domain/repositories/IAuthRepository"
import { IHashProvider } from "@/providers/HashProvider/domain/IHashProvider"
import { ConsoleLogger } from "@/providers/Logger/infrastructure/ConsoleLogger"
import { AuthValidator } from "../validator/AuthValidator"

export class RegisterUseCase {

  constructor(
    private repository: IAuthRepository,
    private hashProvider: IHashProvider,
    private logger: ConsoleLogger
  ) {}

  async execute(dto: RegisterDTO): Promise<{ message: string }> {
     AuthValidator.validateRegister(dto)

    const existingUser = await this.repository.findUserByEmail(dto.email)

    if (existingUser) {
      throw new Error("Utilisateur déjà existant")
    }

    const hashedPassword = await this.hashProvider.hash(dto.password)

    await this.repository.createUser(
      dto.name,
      dto.email,
      hashedPassword
    )

    this.logger.info(" Utilisateur enregistré avec succès", {
      email: dto.email
    })

    return {
      message: "Utilisateur créé avec succès"
    }

  }

}
