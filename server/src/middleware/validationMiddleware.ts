import { ZodError, type ZodObject } from "zod"

export const validateRequest = (schema: ZodObject) => {
    return (req: any, res: any, next: any) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const issues = error.issues.reduce(((acc: any, issue) => ( { ...acc, [issue.path[0] as string]: issue.message } )), {});
                console.log(error);

                res.status(422).json({ issues });
            } else {
                res.status(400).json({ message: "Unknown validation error" });
            }
        }
    }
}
