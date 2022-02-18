import axios, { AxiosError } from 'axios';
import { toast } from 'src/components';
import { BaseUser, KRFull, ObjectiveFull, TeamFull, UserFull } from './entities';

export function createOrUpdateEntity<T>(url: string, entity: any, type: 'add' | 'update') {
    url =
        type === 'update' ? `${url}/${entity.id || entity.username || entity.name}` : `${url}/new`;
    return axios({
        method: type === 'update' ? 'put' : 'post',
        url: url,
        data: entity,
    });
}

export function createOrUpdateUser(user: BaseUser, type: 'add' | 'update') {
    return createOrUpdateEntity('/users', user, type);
}

export function createOrUpdateOkr(okr: OKR, type: 'add' | 'update') {
    return createOrUpdateEntity('/okrs', okr, type);
}

export async function getUsers() {
    const res = await axios.request<UserFull[]>({
        method: 'get',
        url: '/users',
    });
    return res.data;
}

export async function deleteUser(user: UserFull) {
    await axios.request({
        method: 'delete',
        url: `/users/${user.username}`,
    });
}

axios.interceptors.response.use(undefined, (error: AxiosError) => {
    const { status, data } = error.response || {};
    toast({ message: data, severity: 'error' });
    if (status === 401 || status === 403) {
        //
    }
    throw error;
});

export async function getTeams() {
    const res = await axios.request<TeamFull[]>({
        method: 'get',
        url: '/teams',
    });
    return res.data;
}

export async function createOrUpdateTeam(team: TeamFull, type: 'add' | 'update') {
    let url = '/teams/new';
    if (type === 'update') {
        url = `/teams/${team.name}`;
    }
    await axios.request({
        method: type === 'update' ? 'put' : 'post',
        url: url,
        data: team,
    });
}

export async function addMemberToTeam(teamname: string, username: string) {
    await axios.request({
        method: 'post',
        url: `/teams/add_member/${teamname}`,
        data: { username },
    });
}

export async function removeMemberFromTeam(teamname: string, username: string) {
    await axios.request({
        method: 'delete',
        url: `/teams/remove_member/${teamname}`,
        data: { username },
    });
}

export async function deleteTeam(team: TeamFull) {
    await axios.request({
        method: 'delete',
        url: `/teams/${team.name}`,
    });
}

export async function getObjectives(okrId: string) {
    const res = await axios.request<ObjectiveFull[]>({
        method: 'get',
        url: `/okrs/${okrId}/objectives`,
    });
    return res.data;
}

export async function createOrUpdateObjective(
    objective: ObjectiveFull,
    okrId: string,
    type: 'add' | 'update'
) {
    let url = `/okrs/${okrId}/new_objective`;
    if (type === 'update') {
        url = `/okrs/${okrId}/objectives/${objective.id}`;
    }
    await axios.request({
        method: type === 'update' ? 'put' : 'post',
        url: url,
        data: objective,
    });
}

export async function deleteObjective(objective: ObjectiveFull, okrId: string) {
    await axios.request({
        method: 'delete',
        url: `/okrs/${okrId}/objectives/${objective.id}`,
    });
}

export async function getKRs(objectiveId: string, okrId: string) {
    const res = await axios.request<KRFull[]>({
        method: "get",
        url: `/okrs/${okrId}/objectives/${objectiveId}`,
    })
    return res.data;
}

export async function createOrUpdateKR(kr: KRFull, objectiveId: string, okrId: string, type: "add" | "update") {
    let url = `/okrs/${okrId}/objectives/${objectiveId}/new_kr`;
    if (type === "update") {
        url = `/okrs/${okrId}/objectives/${objectiveId}/krs/${kr.id}`;
    }
    await axios.request({
        method: type === "update" ? 'put' : 'post',
        url: url,
        data: kr,
    })
}

export async function deleteKR(kr: KRFull, objectiveId: string, okrId: string) {
    await axios.request({
        method: "delete",
        url: `/okrs/${okrId}/objectives/${objectiveId}/krs/${kr.id}`
    })
}

export async function logout() {
    await axios.post('/users/sign_out');
    window.location.href = '/authentication';
}
