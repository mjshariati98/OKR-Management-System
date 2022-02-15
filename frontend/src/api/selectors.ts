import { denormalize, schema } from 'normalizr';
import mockData from './mock-id.json';

const data = transformMockData();

function transformMockData() {
    return Object.fromEntries(
        Object.entries(mockData).map(([k, arr]) => [
            k,
            Object.fromEntries(arr.map((it) => [it.id, it])),
        ])
    );
}

function calcAndSavePercentage(node: OKR | Objective | KeyResult): number {
    const reducerFunc = (
        acc: number,
        kr: Objective | KeyResult,
        _: number,
        items: (Objective | KeyResult)[]
    ): number => (acc + calcAndSavePercentage(kr)) / items.length;

    if ('objectives' in node) {
        return (node.progressPercent = node.objectives.reduce<number>(reducerFunc, 0));
    }

    if ('keyResults' in node) {
        return (node.progressPercent = node.keyResults.reduce<number>(reducerFunc, 0));
    }

    if (Array.isArray(node.progressPercent)) {
        node.progressItems = node.progressPercent;
        node.progressPercent = node.progressPercent.reduce<number>(reducerFunc, 0);
    }
    return node.progressPercent;
}

function injectionTransform(company: Company) {
    const OkrTranformer = (target: Target) => (okr: OKR) => {
        okr.target = target;
        calcAndSavePercentage(okr);
        okr.objectives.forEach((obj: Objective) => {
            obj.okr = okr;
            obj.target = target;
            obj.keyResults.forEach((kr: KeyResult) => {
                kr.target = target;
                kr.objective = obj;
            });
        });
    };
    company.type = 'company';
    company.okrs.forEach(OkrTranformer(company));
    company.teams.forEach((team) => {
        team.type = 'team';
        team.company = company;
        team.okrs.forEach(OkrTranformer(team));
        team.members.forEach((user) => {
            user.type = 'user';
            user.team = team;
            user.name = user.fullname;
            user.okrs?.forEach(OkrTranformer(user));
        });
    });
}

const round = new schema.Entity('rounds');
const keyresult = new schema.Entity('keyresults');

const objective = new schema.Entity('objectives', {
    keyResults: [keyresult],
});

keyresult.define({
    progressPercent: [objective],
});

const okr = new schema.Entity('okrs', {
    round: round,
    objectives: [objective],
});

const user = new schema.Entity('users', { okrs: [okr] });
const team = new schema.Entity('teams', { okrs: [okr], members: [user] });
const company = new schema.Entity('companies', {
    okrs: [okr],
    teams: [team],
});

export function getCompany(companyId: ID) {
    const companyResult: Company = denormalize(companyId, company, data);
    injectionTransform(companyResult);
    return companyResult;
}

export function getTarget(params: {
    childTargetType?: ChildTarget['type'];
    childTargetId?: ID;
}) {
    const company = getCompany('company-1');
    if (!company) new Error('404');

    const type = params.childTargetType;
    const isTeam = type === 'team',
        isUser = type === 'user';

    const team = isTeam ? company.teams.find((team) => team.id === params.childTargetId) : null;
    const user = isUser
        ? company.teams.flatMap((t) => t.members).find((user) => user.id === params.childTargetId)
        : null;

    if ((isTeam && !team) || (isUser && !user)) throw new Error('404');

    const childTarget = team || user;

    return {
        company,
        childTarget,
        target: childTarget || company,
        //
        team,
        user,
    };
}
