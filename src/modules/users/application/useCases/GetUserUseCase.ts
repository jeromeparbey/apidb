import { GetUserDTO } from "../dto/GetUserDTO"
import { IUserRepository } from "../../domain/repositories/IUserRepository"
import { redisClient } from "@/lib/redis"
import { UserValidator } from "../validator/UserValidator"
import { ConsoleLogger } from "@/providers/Logger/infrastructure/ConsoleLogger"
import { User } from "../../domain/entities/User"

export class GetUserUseCase {

  constructor(
    private repository: IUserRepository,
    private logger: ConsoleLogger
  ) {}

  async execute(dto: GetUserDTO): Promise<User | null> {

    // Validation
    UserValidator.validateGet(dto)

    // Vérifier cache Redis
    const cachedUser = await redisClient.get(`user:${dto.id}`)

    if (cachedUser) {

      this.logger.info("Utilisateur récupéré depuis Redis", {
        userId: dto.id
      })

      const parsedUser = JSON.parse(cachedUser)

      return new User({
        id: parsedUser.id,
        name: parsedUser.name,
        email: parsedUser.email,
        password: "",
        role: parsedUser.role,
        twoFactorEnabled: false
      })

    }

    // Sinon récupérer en base
    const user = await this.repository.findById(dto.id!)

    if (!user) {
      throw new Error("Utilisateur introuvable")
    }

    // Mettre en cache Redis
    await redisClient.set(
      `user:${user.id}`,
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }),
      "EX",
      3600
    )

    // Logger
    this.logger.info("Utilisateur récupéré depuis la base", {
      userId: user.id
    })

    return user
  }

}
