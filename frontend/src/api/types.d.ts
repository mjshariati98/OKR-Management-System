type ID = string;

interface Team {
    name: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
    teamLeader: string;
    productManager: string;
    members: UserFull[];
}

interface Round {}

interface OKR {
    id: number;
    description: string;
    okrProgress: number;
    roundId: number;
    team: Team['name'];
    createdAt: string;
    updatedAt: string;
    objectives: Objective[];
}

interface Objective {
    id: ID;
    description: string;
    keyResults: KeyResult[];
}
interface KeyRessult {
    id: ID;
    description: string;
}
