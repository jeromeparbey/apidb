
import { ZodSchema } from "zod"
import { NextResponse } from "next/server"
import { ResponseProvider } from "@/providers/Response/infrastructure/ResponseProvider"

export async function validateRequest<T>(
  schema: ZodSchema<T>,
  data: unknown
) {

  const result = schema.safeParse(data)

  if (!result.success) {

    const errors = result.error.issues.map(
      (err) => err.message
    )

    const response = ResponseProvider(
      400,
      "Validation error",
      errors
    )

    return NextResponse.json(response, { status: 400 })

  }

  return result.data

}
