import { NextRequest } from "next/server"
import { UserController } from "@/modules/users/infrastructure/UserController"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return UserController.get(req, params.id)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return UserController.update(req, params.id)
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return UserController.delete(req, params.id)
}
