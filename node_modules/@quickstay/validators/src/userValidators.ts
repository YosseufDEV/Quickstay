import z from "zod";


// TODO: Understand the regex and make it more readable
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;

const loginSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long")
});

const signUpSchema = z.object({
    email: z.email("Please enter a valid email address").min(1, "Email is required"),
    password: z
                .string()
                .min(8, "Password must be at least 8 characters long")
                .regex(/[A-Z]/, "Password must contain an uppercase letter")
                .regex(/[a-z]/, "Password must contain a lowercase letter")
                .regex(/[0-9]/, "Password must contain a number")
                .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
    firstName: z.string("First name is required").min(3, "First name is required"),
    lastName: z.string("Last name is required").min(3, "Last name is required"),
    country: z.string("Country is required").min(2, "Country is required"),
});

export { loginSchema, signUpSchema };
