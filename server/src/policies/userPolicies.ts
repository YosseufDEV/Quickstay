const canGetUser = (user: { id: string, role: string }, requestingUserId: string) => {
    const { id, role } = user;

    // TODO: fix case-sensitivity of role
    return role === 'admin' || id === requestingUserId;
}

const canGetAllUsers = (user: { role: string }) => {
    return user.role === 'admin';
}

export { canGetUser, canGetAllUsers };
