import { NextRequest, NextResponse } from "next/server"

import { PrismaUserRepository } from "./PrismaUserRepository"

import { CreateUserUseCase } from "../application/useCases/CreateUserUseCase"
import { UpdateUserUseCase } from "../application/useCases/UpdateUserUseCase"
import { GetUserUseCase } from "../application/useCases/GetUserUseCase"
import { DeleteUserUseCase } from "../application/useCases/DeleteUserUseCase"

import { BcryptHashProvider } from "@/providers/HashProvider/infrastructure/BcryptHashProvider"
import { ConsoleLogger } from "@/providers/Logger/infrastructure/ConsoleLogger"

import { ResponseProvider } from "@/providers/Response/infrastructure/ResponseProvider"

import { errorMiddleware } from "@/middlewares/errorMiddleware"

const repository = new PrismaUserRepository()

const hashProvider = new BcryptHashProvider()

const logger = new ConsoleLogger()

export class UserController {

  // CREATE USER
  static async create(req: NextRequest) {

    try {

      const body = await req.json()

      const useCase = new CreateUserUseCase(
        repository,
        hashProvider,
        logger
      )

      const result = await useCase.execute(body)

      const response = ResponseProvider(
        201,
        "Utilisateur créé avec succès",
        result
      )

      return NextResponse.json(response)

    } catch (error) {

      return errorMiddleware(error)

    }

  }

  // GET USER
  static async get(req: NextRequest, id: string) {

    try {

      const useCase = new GetUserUseCase(
        repository,
        logger
      )

      const result = await useCase.execute({
        id
      })

      const response = ResponseProvider(
        200,
        "Utilisateur récupéré",
        result
      )

      return NextResponse.json(response)

    } catch (error) {

      return errorMiddleware(error)

    }

  }

  // UPDATE USER
  static async update(req: NextRequest, id: string) {

    try {

      const body = await req.json()

      const useCase = new UpdateUserUseCase(
        repository,
        hashProvider,
        logger
      )

      const result = await useCase.execute({
        id,
        ...body
      })

      const response = ResponseProvider(
        200,
        "Utilisateur mis à jour",
        result
      )

      return NextResponse.json(response)

    } catch (error) {

      return errorMiddleware(error)

    }

  }

  // DELETE USER
  static async delete(req: NextRequest, id: string) {

    try {

      const useCase = new DeleteUserUseCase(
        repository,
        logger
      )

      const result = await useCase.execute({
        id
      })

      const response = ResponseProvider(
        200,
        "Utilisateur supprimé",
        result
      )

      return NextResponse.json(response)

    } catch (error) {

      return errorMiddleware(error)

    }

  }

}
