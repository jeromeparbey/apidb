
import { CreateUserDTO } from "../dto/CreateUserDTO"
import { UpdateUserDTO } from "../dto/UpdateUserDTO"

export class UserValidator {

  // Validation pour la création d'un utilisateur
  static validateCreate(dto: CreateUserDTO) {
    const errors: string[] = []

    if (!dto.name || dto.name.trim().length < 2) {
      errors.push("Nom trop court")
    }

    if (!dto.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email)) {
      errors.push("Email invalide")
    }

    if (!dto.password || dto.password.length < 6) {
      errors.push("Mot de passe trop court")
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "))
    }
  }

  // Validation pour la mise à jour d'un utilisateur
  static validateUpdate(dto: UpdateUserDTO) {
    const errors: string[] = []

    if (!dto.id) {
      errors.push("User ID est requis")
    }

    if (dto.name && dto.name.trim().length < 2) {
      errors.push("Nom trop court")
    }

    if (dto.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email)) {
      errors.push("Email invalide")
    }

    if (dto.password && dto.password.length < 6) {
      errors.push("Mot de passe trop court")
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "))
    }
  }

  // Validation pour la suppression d'un utilisateur
  static validateDelete(dto: { id: string }) {
    if (!dto.id) {
      throw new Error("User ID est requis")
    }
  }

  // Validation pour la récupération d'un utilisateur
  static validateGet(dto: { id: string }) {
    if (!dto.id) {
      throw new Error("User ID est requis")
    }
  }

}
