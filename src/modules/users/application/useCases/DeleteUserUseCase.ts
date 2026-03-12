import { DeleteUserDto } from "../dto/DeleteUserDTO"
import { IUserRepository } from "../../domain/repositories/IUserRepository"
import { redisClient } from "@/lib/redis"
import { UserValidator } from "../validator/UserValidator"
import { ConsoleLogger } from "@/providers/Logger/infrastructure/ConsoleLogger"

export class DeleteUserUseCase {

  constructor(
    private repository: IUserRepository,
    private logger: ConsoleLogger
  ) {}

  async execute(dto: DeleteUserDto): Promise<void> {

    //  Validation
    UserValidator.validateDelete(dto)

    // Vérifier si utilisateur existe
    const user = await this.repository.findById(dto.id)

    if (!user) {
      throw new Error("Utilisateur introuvable")
    }

    //  Supprimer en base
    await this.repository.delete(dto.id)

    //  Supprimer le cache Redis
    await redisClient.del(`user:${dto.id}`)

    // Logger
    this.logger.info("Utilisateur supprimé", {
      userId: dto.id
    })

  }

}
