import type { User } from "../types/user";

const canViewProtectedContent = (user: User) => {
    console.log("I'm in the policy function");
    return user.role === "admin";
}

export { canViewProtectedContent };  
