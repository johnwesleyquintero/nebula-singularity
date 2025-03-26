export class AppError extends Error {
  statusCode: number
  code: string

  constructor(message: string, statusCode: number, code: string) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class ValidationError extends AppError {
  details: Record<string, string[]>

  constructor(errors: Record<string, string[]>) {
    super("Validation failed", 400, "VALIDATION_ERROR")
    this.details = errors
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 500, "DATABASE_ERROR")
  }
}

export class AuthError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, "AUTH_ERROR")
  }
}

export class ZodValidationError extends AppError {
  issues: Zod.Issue[]

  constructor(issues: Zod.Issue[]) {
    super("Invalid request data", 422, "ZOD_VALIDATION")
    this.issues = issues
  }
}