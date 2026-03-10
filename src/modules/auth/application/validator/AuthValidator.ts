import { LoginDTO } from "../dto/LoginDTO"
import { RegisterDTO } from "../dto/RegisterDTO"
import { ForgotPasswordDTO } from "../dto/ForgotPasswordDTO"
import { VerifyOtpDTO } from "../dto/VerifyOtpDTO"

export class AuthValidator {

  static validateLogin(dto: LoginDTO) {

    const errors: string[] = []

    if (!dto.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email))
      errors.push("Email invalide")

    if (!dto.password)
      errors.push("Mot de passe requis ")

    if (errors.length)
      throw new Error(errors.join(", "))
  }


  static validateRegister(dto: RegisterDTO) {

  const errors: string[] = []

  if (!dto.name || dto.name.length < 2)
    errors.push("Nom trop court ")

  if (!dto.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email))
    errors.push("Email invalide")

  if (!dto.password || dto.password.length < 6)
    errors.push("Mot de passe trop court")

  if (errors.length)
    throw new Error(errors.join(", "))
}



static validateForgotPassword(dto: ForgotPasswordDTO) {

  if (!dto.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email))
    throw new Error("²Email invalid")

}



static validateVerifyOtp(dto: VerifyOtpDTO) {

  const errors: string[] = []

  if (!dto.email)
    errors.push("Email requis")

  if (!dto.code || dto.code.length !== 6)
    errors.push("Code Otp invalide")

  if (errors.length)
    throw new Error(errors.join(", "))
}


}