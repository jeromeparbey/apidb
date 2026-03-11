import { User, Otp, ResetPassword } from "@prisma/client"

export interface IAuthRepository {

  // Users
  findUserByEmail(email: string): Promise<User | null>

  createUser(
    name: string,
    email: string,
    password: string
  ): Promise<User>

  // OTP (double authentification)
  createOtp(
    userId: string,
    code: string,
    expiresAt: Date
  ): Promise<Otp>

  findOtp(
    email: string,
    code: string
  ): Promise<Otp | null>

  markOtpUsed(otpId: string): Promise<void>

  // Reset Password
  createResetPassword(
    userId: string,
    token: string,
    expiresAt: Date
  ): Promise<ResetPassword>
// trouver le reset password via OTP
findResetPasswordByOtp(otp: string): Promise<ResetPassword | null>

// Met à jour le mot de passe d'un utilisateur
updateUserPassword(userId: string, hashedPassword: string): Promise<void>


  findResetPassword(
    email: string,
    token: string
  ): Promise<ResetPassword | null>

  markResetPasswordUsed(resetPasswordId: string): Promise<void>
}
