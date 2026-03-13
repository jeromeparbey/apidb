import { NextRequest } from "next/server"
import { UserController } from "@/modules/users/infrastructure/UserController"


export async function GET(
  req: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  // Si params est un Promise (App Router moderne)
  const resolvedParams = context.params instanceof Promise ? await context.params : context.params;

  console.log("Paramètre id reçu :", resolvedParams.id);

  return UserController.get(req, resolvedParams.id);
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
