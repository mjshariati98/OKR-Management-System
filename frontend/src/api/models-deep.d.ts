type ID = string;

type ChildTarget = User | Team ;
type Target = ChildTarget | Company;

interface User {
    id: UserID;
    type: 'user';
    fullname: string;
    name: string;
    username: string;
    team: Team;
    okrs?: OKR[];
}

interface Team {
    id: TeamID;
    type: 'team';
    name: string;
    members: User[];
    company: Company;
    okrs: OKR[];
}

interface OKR {
    id: OkrID;
    round: Round;
    target: Target;
    objectives: Objective[];
    progressPercent: number;
}

interface Company {
    id: CompanyID;
    type: 'company';
    name: string;
    okrs: OKR[];
    teams: Team[];
}

interface Objective {
    id: ObjectiveID;
    title: string;
    description?: string;
    target: Target;
    okr: OKR;
    keyResults: KeyResult[];
    progressPercent: number; // average of key results progress
}

interface KeyResult {
    id: KeyResultID;
    title: string;
    description?: string;
    target: Target;
    objective: Objective;
    progressItems: Objective[];
    progressPercent: number; // | (KeyResult | Objective)[];
}

interface Round {
    id: RoundID;
    title: string;
    startDate: string;
    endDate: string;
}
