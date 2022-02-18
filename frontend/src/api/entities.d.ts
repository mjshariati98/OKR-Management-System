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

export interface BaseKR {
    title: string;
    weight: number;
    description?: string;
}

export interface KRFull extends BaseKR {
    id: string;
    done: number;
    createdAt?: string;
    objectiveId: string;
}

export interface BaseObjective {
    title: string;
    description: string;
    weight: number;
}
export interface ObjectiveFull extends BaseObjective {
    id: string;
    createdAt?: string;
    okrId: string;
    krs: KR[];
    objectiveProgress: number;
}

export interface BaseOkr {
    team: string;
    roundId: string;
    description?: string;
}
export interface OkrFull extends BaseOkr {
    id: string;
    createdAt?: string;
    okrProgress: number;
    objectives: Objective[]
}
