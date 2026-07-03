import bcrypt from 'bcrypt';
import type { IUser } from '@quickstay/types/User';
import drizzle from '../db/drizzle';
import { users } from '../db/schema';

class User {
    static createUser = async (userData: Omit<IUser & { password: string }, "role">) => {

        const salt = bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, await salt);

        const user = await drizzle.insert(users).values({ ...userData, role: "USER" }).returning().then(([user]) => user)

        return user!; 
    }

    static getUserById = async (userId: string) => {
        return await drizzle.query.users.findFirst({
            where: {
                id: userId
            },
            columns: {
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                country: true,
            }
        });
    }

    static getUserByEmail = async (email: string) => {
        return await drizzle.query.users.findFirst({
            where: {
                email: email,
            },
            columns: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                password: true,
                country: true,
            }
        });
    }

    static getAllUsers = async () => {
        return await drizzle.query.users.findMany();
    }
}

export { User };
