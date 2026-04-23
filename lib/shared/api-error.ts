import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "AUTH_REQUIRED"
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_BANNED"
  | "VALIDATION_ERROR"
  | "USERNAME_TAKEN"
  | "NOT_FOUND"
  | "PRIVACY_RESTRICTED"
  | "FOLLOW_REQUEST_PENDING"
  | "BOARD_ITEM_EXISTS"
  | "FILE_TOO_LARGE"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "FORBIDDEN"
  | "INVALID_TOKEN"
  | "RATE_LIMITED"
  | "INTERNAL_SERVER_ERROR";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: ApiErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function validationError(message: string, details?: Record<string, unknown>): ApiError {
  return new ApiError(422, "VALIDATION_ERROR", message, details);
}

export function mapApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          ...(error.details ? { details: error.details } : {})
        }
      },
      { status: error.status }
    );
  }

  console.error(error);

  return NextResponse.json(
    {
        error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Unexpected server error."
      }
    },
    { status: 500 }
  );
}
