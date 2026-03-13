import { CreateUserDTO } from "../dto/CreateUserDTO"
import { IUserRepository } from "../../domain/repositories/IUserRepository"
import { IHashProvider } from "@/providers/HashProvider/domain/IHashProvider"
import { ConsoleLogger } from "@/providers/Logger/infrastructure/ConsoleLogger"
import { redisClient } from "@/lib/redis"
import { User  , UserRole} from "../../domain/entities/User"
import { UserValidator } from "../validator/UserValidator"

export class CreateUserUseCase {

  constructor(
    private repository: IUserRepository,
    private hashProvider: IHashProvider,
    private logger: ConsoleLogger
  ) {}

  async execute(dto: CreateUserDTO): Promise<User> {

    //  Validation des données
    UserValidator.validateCreate(dto)

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.repository.findByEmail(dto.email)

    if (existingUser) {
      throw new Error("Cet email est déjà utilisé")
    }

    // Hash du password
    const hashedPassword = await this.hashProvider.hash(dto.password)

    // Création de l'entity User
    const user = new User({
      id: crypto.randomUUID(),
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: (dto.role as UserRole)?? "USER"
    })

    //  Sauvegarde dans la base
    const createdUser = await this.repository.create(user)

    //  Cache Redis (optimisation lecture)
    // await redisClient.set(
    //   `user:${createdUser.id}`,
    //   JSON.stringify({
    //     id: createdUser.id,
    //     name: createdUser.name,
    //     email: createdUser.email,
    //     role: createdUser.role
    //   }),
    //   "EX",
    //   3600
    // )

    // 7️⃣ Logger
    this.logger.info("Utilisateur créé", {
      userId: createdUser.id,
      email: createdUser.email
    })

    return createdUser
  }

}
