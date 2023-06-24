interface IUser {
    username: string;
    permissionLevel: "locked" | "user" | "technician" | "admin";
    password: string;
    contactAdress: string; // email or phone number
    dId?: string; // discord id
}

export default IUser;
