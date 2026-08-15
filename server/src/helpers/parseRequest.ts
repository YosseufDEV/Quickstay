import { AppError } from "@/errors/errors";
import z, { ZodType } from "zod";

export const parseRequest = <T extends ZodType>(
    schema: T, 
    params: Record<any, any>, 
    type: "query" | "params" = "params"
): z.output<T> => {
    if(!params) {
        throw new AppError({ message: `request_${type}_required`, statusCode: 400 });
    }

    const result = schema.safeParse(params);

    if(!result.success) {
        const issues = result.error.issues.reduce(((acc: any, issue) => ( { ...acc, [issue.path[0] as string]: issue.message } )), {});
        throw new AppError({ message: `invalid_request_${type}`, statusCode: 400, payload: { issues } });
    }

    return result.data;
}

