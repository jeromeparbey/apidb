import { IAuthRepository } from "../../auth/domain/repositories/IAuthRepository"
import { prisma } from "@/lib/prisma"
import { User, Otp, ResetPassword } from "@prisma/client"

export class PrismaAuthRepository implements IAuthRepository {

  // Selection sécurisée des champs utilisateur
  private userSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    password: true ,
    twoFactorEnabled: true,
    twoFactorSecret: true,
    createdAt: true,
    updatedAt: true
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      select: this.userSelect
    })
  }

  async createUser(name: string, email: string, password: string): Promise<User> {
    return prisma.user.create({
      data: { name, email, password },
    })
  }

  // OTP pour double authentification
  async createOtp(userId: string, code: string, expiresAt: Date): Promise<Otp> {
    return prisma.otp.create({
      data: { userId, code, expiresAt }
    })
  }

  async findOtp(email: string, code: string): Promise<Otp | null> {
    return prisma.otp.findFirst({
      where: {
        code,
        user: { email }
      },
      orderBy: { createdAt: "desc" }
    })
  }

  async markOtpUsed(otpId: string): Promise<void> {
    await prisma.otp.update({
      where: { id: otpId },
      data: { status: "USED" }
    })
  }

  // Reset Password
  async createResetPassword(userId: string, token: string, expiresAt: Date): Promise<ResetPassword> {
    return prisma.resetPassword.create({
      data: { userId, token, expiresAt }
    })
  }
  
async findResetPasswordByOtp(otp: string): Promise<ResetPassword | null> {
  return prisma.resetPassword.findFirst({
    where: { token: otp, status: "PENDING" },
    orderBy: { createdAt: "desc" }
  })
}

  async findResetPassword(email: string, token: string): Promise<ResetPassword | null> {
    return prisma.resetPassword.findFirst({
      where: {
        token,
        user: { email }
      },
      orderBy: { createdAt: "desc" }
    })
  }


async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  })
}


  async markResetPasswordUsed(resetPasswordId: string): Promise<void> {
    await prisma.resetPassword.update({
      where: { id: resetPasswordId },
      data: { status: "USED" }
    })
  }
}
