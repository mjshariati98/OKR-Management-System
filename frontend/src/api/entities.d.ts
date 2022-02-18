import { Role } from './enums';

export interface BaseUser {
    id?: string;
    username: string;
    firstname?: string | null;
    lastname?: string | null;
    email?: string | null;
    phone?: string | null;
}

export interface UserFull extends BaseUser {
    role: Role;
    createdAt?: string;
    role: Role | `${Role}`;
    createdAt: string;
    updatedAt: string;
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
