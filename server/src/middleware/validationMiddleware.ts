import { sendResponse } from "@/helpers/response";
import { ZodError, type ZodObject } from "zod"

export const validateRequest = (schema: ZodObject) => {
    return (req: any, res: any, next: any) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const issues = error.issues.reduce(((acc: any, issue) => ( { ...acc, [issue.path[0] as string]: issue.message } )), {});

                return sendResponse(res, { statusCode: 422, errors: { issues } });
            } else {
                return sendResponse(res, { statusCode: 400, message: "Unknown validation error" });
            }
        }
    }
}
