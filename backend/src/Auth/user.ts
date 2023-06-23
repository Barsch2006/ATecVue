interface IUser {
    username: string;
    permissionLevel: "locked" | "user" | "technician" | "admin";
    password: string;
}

export default IUser;
