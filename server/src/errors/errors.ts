interface ErrorPayload {
  message: string;
  name?: string;
  statusCode?: number;
  originalError?: Error;
  payload?: Record<string, any>;
}

export class AppError extends Error {
  statusCode: number;
  message: string;
  originalError?: Error;
  payload?: Record<string, any>;
  name: string;

  constructor({ message, statusCode = 500, originalError, payload, name='AppError' }: ErrorPayload) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.name = name;
    this.originalError = originalError;
    this.payload = payload;
  }
}

interface AuthErrorPayload {
  message: string;
  originalError?: Error;
  payload?: Record<string, any>;
}

export class AuthenticationError extends AppError {
  constructor({ message, originalError, payload }: AuthErrorPayload) {
    super({ message, statusCode: 401, originalError, payload });
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor({ message, originalError, payload }: AuthErrorPayload) {
    super({ message, statusCode: 403, originalError, payload });
    this.name = "AuthorizationError";
  }
}

export class TokenRefreshError extends AppError {
  constructor({ message, originalError, payload }: AuthErrorPayload) {
    super({ message, statusCode: 400, originalError, payload });
    this.name = "TokenRefreshError";
  }
}

interface UserErrorPayload {
  message: string;
  statusCode?: number;
  originalError?: Error;
  payload?: Record<string, any>;
}

export class UserError extends AppError {
  constructor({ message, statusCode = 400, originalError, payload }: UserErrorPayload) {
    super({ message, statusCode, originalError, payload });
    this.name = "UserError";
  }
}
