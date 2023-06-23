import { ObjectId } from 'mongodb';

interface IUser {
    id: ObjectId;
    name: string;
    email: string;
    password: string;
}

export default IUser;
