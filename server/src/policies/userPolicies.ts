import type { UserRole } from "@/db/schema";

const canGetUser = (user: { id: string, role: UserRole }, requestingUserId: string) => {
    const { id, role } = user;

    // TODO: fix case-sensitivity of role
    return role === 'ADMIN' || id === requestingUserId;
}

const canGetAllUsers = (user: { role: UserRole }) => {
    return user.role === 'ADMIN';
}

const canGetUserBookings = (user: { id: string, role: UserRole }, requestingUserId: string) => {
    const { id, role } = user;

    console.log(`Checking if user ${requestingUserId} can get bookings for user ${id} with role ${role}`);

    return role === 'ADMIN' || id === requestingUserId;
}

export { canGetUser, canGetAllUsers, canGetUserBookings };
