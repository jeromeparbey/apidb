import { CreateUserDTO } from "../dto/CreateUserDTO"
import { UpdateUserDTO } from "../dto/UpdateUserDTO"

export class UserValidator {

  static validateCreate(dto: CreateUserDTO) {

    const errors: string[] = []

    if (!dto.name || dto.name.length < 2)
      errors.push("nom trop court")

    if (!dto.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email))
      errors.push("email invalide")

    if (!dto.password || dto.password.length < 6)
      errors.push("mot de passe trop court")

    if (errors.length)
      throw new Error(errors.join(", "))

  }



  

// validation de donner mise à jour 

static validateUpdate(dto: UpdateUserDTO) {

  const errors: string[] = []

  if (!dto.id)
    errors.push("user id est requis")

  if (dto.name && dto.name.length < 2)
    errors.push("name trop court")

  if (dto.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email))
    errors.push("Invalid email")

  if (errors.length)
    throw new Error(errors.join(", "))
}

// validation des données delete 
static validateDelete(dto: { id: string }) {

  if (!dto.id)
    throw new Error("User id est requis")

}





static validateGet(dto: { id: string }) {

  if (!dto.id)
    throw new Error("user id est requis") 

}

}

