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
    createdAt?: string;
    teamName?: string;
}
export interface TeamFull {
    name: string;
    teamLeader: BaseUser["username"];
    description?: string;
    productManager?: BaseUser["username"];
    members?: UserFull[];
    createdAt?: string;
}
