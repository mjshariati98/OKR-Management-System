import axios, { AxiosError } from 'axios';
import { BaseObjective, BaseUser, ObjectiveFull, TeamFull, UserFull } from './entities';

export function createOrUpdateUser(user: BaseUser, type: "add" | "update") {
    let url = "/users/new";
    if (type === "update") {
        url = `/users/${user.username}`
    }
    return axios({
        method: type === "update" ? 'put' : 'post',
        url: url,
        data: user,
    });
}

export async function getUsers() {
    const res = await axios.request<UserFull[]>({
        method: "get",
        url: "/users"
    });
    return res.data;
}

export async function deleteUser(user: UserFull) {
    await axios.request({
        method: "delete",
        url: `/users/${user.username}`
    })
}

axios.interceptors.response.use(undefined, (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
        // 
    }
});

export async function getTeams() {
    const res = await axios.request<TeamFull[]>({
        method: "get",
        url: "/teams",
    })
    return res.data;
}

export async function createOrUpdateTeam(team: TeamFull, type: "add" | "update") {
    let url = "/teams/new";
    if (type === "update") {
        url = `/teams/${team.name}`
    }
    await axios.request({
        method: type === "update" ? 'put' : 'post',
        url: url,
        data: team,
    })
}

export async function addMemberToTeam(teamname: string, username: string) {
    await axios.request({
        method: "post",
        url: `/teams/add_member/${teamname}`,
        data: { username }
    })
}

export async function removeMemberFromTeam(teamname: string, username: string) {
    await axios.request({
        method: "delete",
        url: `/teams/remove_member/${teamname}`,
        data : { username },
    })
}

export async function deleteTeam(team: TeamFull) {
    await axios.request({
        method: "delete",
        url: `/teams/${team.name}`
    })
}

export async function getObjectives(okrId: string) {
    const res = await axios.request<ObjectiveFull[]>({
        method: "get",
        url: `/okrs/${okrId}/objectives`,
    })
    return res.data;
}

export async function createOrUpdateObjective(objective: ObjectiveFull, okrId: string, type: "add" | "update") {
    let url = `/okrs/${okrId}/new_objective`;
    if (type === "update") {
        url = `/okrs/${okrId}/objectives/${objective.id}`;
    }
    await axios.request({
        method: type === "update" ? 'put' : 'post',
        url: url,
        data: objective,
    })
}

export async function deleteObjective(objective: ObjectiveFull, okrId: string) {
    await axios.request({
        method: "delete",
        url: `/okrs/${okrId}/objectives/${objective.id}`
    })
}

export async function logout() {
    await axios.post('/users/sign_out');
    window.location.href = '/authentication';
}
