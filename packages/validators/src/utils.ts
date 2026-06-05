import { ZodError, ZodObject } from "zod";

export const validateSchema = (schema: ZodObject, data: any) => {
    try {
        schema.parse(data);
        return { success: true, errors: null };
    } catch (error) {
        if (error instanceof ZodError) {
            return { success: false, errors: error.issues };
        }
    }
    return { success: false, errors: [{ message: "An unknown error occurred during validation." }] };
}
