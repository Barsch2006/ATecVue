interface IUser {
    username: string;
    permissionLevel: "locked" | "user" | "technician" | "admin";
    password: string;
    contactAdress: string; // email or phone number
}

export default IUser;
