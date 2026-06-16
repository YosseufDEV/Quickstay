import { describe, vi, it, expect, beforeEach } from "vitest";
import { checkAuthorization } from "./authorizationMiddleware";

let mockRequest = {
    headers: {
        authorization: "",
    },
    user: {
        id: "some_id",
    },
    params: {
        id: "some_id",
    }
}

const mockResponse = {
    status: vi.fn().mockReturnThis(),
    sendStatus: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
}

const mockNext = vi.fn();

const mockResourcelessPolicy = () => {
    return true;
}

const mockResourceFn = vi.fn((req) => {
    return req.params.id;
})

const mockResourcefulPolicy = vi.fn((user, resource) => {
    return user.id === resource;
})

describe("Authorization Middleware Tests", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockRequest  = {
            headers: {
                authorization: "",
            },
            user: {
                id: "some_id",
            },
            params: {
                id: "some_id",
            }
        }
    })

    it("Should call next if user is authorized -- resourceful policy", () => {   
        checkAuthorization(mockResourcefulPolicy, mockResourceFn)(mockRequest as any, mockResponse as any, mockNext);
        expect(mockNext).toHaveBeenCalled();
        expect(mockResourceFn).toHaveBeenCalledWith(mockRequest);
        expect(mockResourceFn).toHaveBeenCalledTimes(1);
    })

    it("Should call next if user is authorized -- resourceless policy", () => {   
        checkAuthorization(mockResourcelessPolicy)(mockRequest as any, mockResponse as any, mockNext);
        expect(mockNext).toHaveBeenCalled();
    })

    it("Should NOT call next if user is not Authenticated & return 401", () => {   
        mockRequest.user = null;

        checkAuthorization(mockResourcelessPolicy)(mockRequest as any, mockResponse as any, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: "Unauthenticated" });
    })

    it("Should NOT call next if user is not authorized and return 403", () => {   
        checkAuthorization(() => false)(mockRequest as any, mockResponse as any, mockNext);

        expect(mockResponse.sendStatus).toHaveBeenCalledWith(403);
    })
})
