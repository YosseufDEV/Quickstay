import { describe, vi, expect, it, beforeEach } from "vitest";
import jwt from "jsonwebtoken";
import { checkAuthentication } from "./authenticationMiddleware";

const realVerifiy = jwt.verify.bind(jwt);
const test_secret = "test_secret";

vi.spyOn(jwt, "verify").mockImplementation((token: string, _: any, options?: jwt.VerifyOptions) => {
    return realVerifiy(token, test_secret, options);
})

const mockRequest  = {
    headers: {
        authorization: "",
    }

}

const mockResponse = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
}

const mockNext = vi.fn();

beforeEach(() => {
    vi.clearAllMocks();
})

describe("Authentication Middleware Tests", () => {
    it("Should not return and error and call the next function", () => {
        const validJWTToken = jwt.sign({ user: "test_id" }, test_secret);
        mockRequest.headers.authorization = `Bearer ${validJWTToken}`;

        expect(() => checkAuthentication(mockRequest as any, mockResponse as any, mockNext)).not.toThrow();
        expect(mockNext).toHaveBeenCalled();
    })

    it("Should return 401 and no token provided message if no token is provided", () => {
        mockRequest.headers.authorization = "";
        checkAuthentication(mockRequest as any, mockResponse as any, mockNext);
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: "token_not_provided" });
    })

    it("Should return 401 and expired message if token is expired", () => {
        const expiredJWTToken = jwt.sign({ user: "test_id" }, test_secret, { expiresIn: "-1s" });
        mockRequest.headers.authorization = `Bearer ${expiredJWTToken}`;

        checkAuthentication(mockRequest as any, mockResponse as any, mockNext);
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: "token_expired" });
    })

    it("Should return 401 and invalid message if token is invalid", () => {
        const expiredJWTToken = jwt.sign({ user: "test_id" }, "bad_secret", { expiresIn: "-1s" });
        mockRequest.headers.authorization = `Bearer ${expiredJWTToken}`;

        checkAuthentication(mockRequest as any, mockResponse as any, mockNext);
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: "token_invalid" });

        mockRequest.headers.authorization = `Bearer malformed_token`;

        checkAuthentication(mockRequest as any, mockResponse as any, mockNext);
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: "token_invalid" });
    })
})
