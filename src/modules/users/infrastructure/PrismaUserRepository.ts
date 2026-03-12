// infrastructure/PrismaUserRepository.ts
import { IUserRepository } from "../domain/repositories/IUserRepository";
import { User, UserRole } from "../domain/entities/User";
import { prisma } from "@/lib/prisma";

export class PrismaUserRepository implements IUserRepository {

  //  Transforme un utilisateur Prisma (DB) en User Entity (domaine)
  private mapToEntity(prismaUser: any): User | null {
    if (!prismaUser) return null;

    return new User({
      id: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
      password: prismaUser.password, 
      role: prismaUser.role as UserRole,
      twoFactorEnabled: prismaUser.twoFactorEnabled,
      twoFactorSecret: prismaUser.twoFactorSecret,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }

  // Chercher un utilisateur par email
  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true,
         name: true, 
         email: true, 
         password: true,
        role: true, 
        twoFactorEnabled: true,
         twoFactorSecret: true,
            createdAt: true,
             updatedAt: true }
    });
    return this.mapToEntity(prismaUser);
  }

  // Chercher un utilisateur par ID
  async findById(id: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true,
         name: true,
          email: true, 
          password: true,
           role: true, 
           twoFactorEnabled: true,
            twoFactorSecret: true,
             createdAt: true, 
             updatedAt: true }
    });
    return this.mapToEntity(prismaUser);
  }

  //  Créer un utilisateur (hash du password déjà fait avant)
  async create(user: User): Promise<User> {
    const prismaUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password, 
        role: user.role ?? UserRole.USER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    // Retourne une User Entity avec les données nécessaires
    return new User({
      id: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
      password: "", 
      role: prismaUser.role as UserRole,
      twoFactorEnabled: false,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }

  //  Mettre à jour un utilisateur (seulement champs nécessaires)
  async update(user: User): Promise<User> {
    const prismaUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return new User({
      id: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
      password: "", 
      role: prismaUser.role as UserRole,
      twoFactorEnabled: false,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }

  // Supprimer un utilisateur
  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
