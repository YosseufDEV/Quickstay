import { AppError } from "@/errors/errors";
import type { ZodObject } from "zod";

export const parseRequest = (schema: ZodObject, params: Record<any, any>, type: "query" | "params"="params") => {
    if(!params) {
        throw new AppError({ message: `request_${type}_required`, statusCode: 400 });
    }

    const result = schema.safeParse(params);

    if(!result.success) {
        const errors = result.error.issues.reduce(((acc: any, issue) => ( { ...acc, [issue.path[0] as string]: issue.message } )), {});
        throw new AppError({ message: `invalid_request_${type}`, statusCode: 400, payload: { errors }});
    }

    return result.data;
}

