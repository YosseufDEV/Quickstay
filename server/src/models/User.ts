import type { IUser } from '@quickstay/types/User';
import drizzle from '../db/drizzle';
import { users } from '../db/schema';

class User {
    static createUser = async (userData: Omit<IUser & { password: string }, "role">) => {
        return await drizzle.insert(users).values({ ...userData, role: "USER" }).returning().then(([user]) => user)!; 
    }

    static getUserById = async (userId: string) => {
        return await drizzle.query.users.findFirst({
            where: {
                id: userId
            }
        });
    }

    static getUserByEmail = async (email: string) => {
        return await drizzle.query.users.findFirst({
            where: {
                email: email,
            }
        });
    }

    static getAllUsers = async () => {
        return await drizzle.query.users.findMany();
    }
}

export { User };
