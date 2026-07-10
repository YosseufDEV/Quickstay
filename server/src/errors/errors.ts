export class AppError extends Error {
    statusCode: number
    message: string
    originalError?: Error | undefined
    name: string

    constructor(message: string, statusCode?: number, originalError?: Error) {
        super(message);
        this.statusCode = statusCode || 500;
        this.message = message;
        this.name = "AppError";
        this.originalError = originalError;
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string, originalError?: Error) {
        super(message, 401, originalError);
        this.name="AuthenticationError";
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string, originalError?: Error) {
        super(message, 403, originalError);
        this.name="AuthorizationError";
    }
}

export class TokenRefreshError extends AppError {
    constructor(message: string, originalError?: Error) {
        super(message, 400, originalError);
        this.name="TokenRefreshError";
    }
}

export class UserError extends AppError {
    constructor(message: string, statusCode?: number, originalError?: Error) {
        super(message, statusCode || 400, originalError);
        this.name="UserError";
    }
}
