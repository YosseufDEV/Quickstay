interface IUser {
    id?: string;
    firstName: string;
    lastName: string;
    country: string;
    role: "user" | "admin";
    email: string;
    password?: string;
}

export { IUser }
