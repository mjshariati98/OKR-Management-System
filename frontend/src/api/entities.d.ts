import { Role } from "./enums";

export interface BaseUser {
    id?: string;
    username: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
}
export interface UserFull extends BaseUser {
    role: Role;
    createdAt: Date;
    teamName?: string;
}