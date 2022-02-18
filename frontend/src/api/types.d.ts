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

interface Round {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

interface OKRLite {
    id: number;
    description: string;
    roundId: number;
    team: Team['name'];
    createdAt: string;
    updatedAt: string;
}

interface OKR extends OKRLite {
    okrProgress: number;
    objectives: Objective[];
}

interface Objective {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    okrId: number;
    description: string;
    weight: number;
    objectiveProgress: number;
    krs: KeyResult[];
}

interface KeyRessult {
    id: number;
    title: string;
    description: string;
    weight: number;
    done: number;
    createdAt: string;
    updatedAt: string;
    objectiveId: number;
    description: string;
}
