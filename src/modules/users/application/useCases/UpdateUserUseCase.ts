import { UpdateUserDTO } from "../dto/UpdateUserDTO"
import { IUserRepository } from "../../domain/repositories/IUserRepository"
import { IHashProvider } from "@/providers/HashProvider/domain/IHashProvider"
import { ConsoleLogger } from "@/providers/Logger/infrastructure/ConsoleLogger"
import { redisClient } from "@/lib/redis"
import { UserValidator } from "../validator/UserValidator"
import { User  , UserRole} from "../../domain/entities/User"

export class UpdateUserUseCase {

  constructor(
    private repository: IUserRepository,
    private hashProvider: IHashProvider,
    private logger: ConsoleLogger
  ) {}

  async execute(dto: UpdateUserDTO): Promise<User> {

    //  Validation
    UserValidator.validateUpdate(dto)

    // Vérifier si l'utilisateur existe
    const existingUser = await this.repository.findById(dto.id)

    if (!existingUser) {
      throw new Error("Utilisateur introuvable")
    }

    // Hash password si modifié
    let hashedPassword = existingUser.password

    if (dto.password) {
      hashedPassword = await this.hashProvider.hash(dto.password)
    }

    // Mise à jour de l'entity
    const updatedUser = new User({
      id: existingUser.id,
      name: dto.name ?? existingUser.name,
      email: dto.email ?? existingUser.email,
      password: hashedPassword,
      role: (dto.role as UserRole) ?? existingUser.role,
      twoFactorEnabled: dto.twoFactorEnabled ?? existingUser.twoFactorEnabled,
      twoFactorSecret: dto.twoFactorSecret ?? existingUser.twoFactorSecret,
      createdAt: existingUser.createdAt,
      updatedAt: new Date()
    })

    // Update base de données
    const savedUser = await this.repository.update(updatedUser)

    //  Mise à jour du cache Redis
    await redisClient.set(
      `user:${savedUser.id}`,
      JSON.stringify({
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }),
      "EX",
      3600
    )

    //  Logger
    this.logger.info("Utilisateur mis à jour", {
      userId: savedUser.id
    })

    return savedUser
  }

}
