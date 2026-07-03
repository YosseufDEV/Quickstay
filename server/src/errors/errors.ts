export class AppError extends Error {
    statusCode: number
    message: string
    name: string

    constructor(message: string, statusCode?: number) {
        super(message);
        this.statusCode = statusCode || 500;
        this.message = message;
        this.name = "AppError";
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string) {
        super(message, 401);
        this.name="AuthenticationError";
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string) {
        super(message, 403);
        this.name="AuthorizationError";
    }
}

export class TokenRefreshError extends AppError {
    constructor(message: string) {
        super(message, 400);
        this.name="TokenRefreshError";
    }
}

export class UserError extends AppError {
    constructor(message: string, statusCode?: number) {
        super(message, statusCode || 400);
        this.name="UserError";
    }
}
