import axios, { AxiosError } from 'axios';
import { BaseUser, UserFull } from './entities';

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

export async function logout() {
    await axios.post('/users/sign_out');
    window.location.href = '/authentication';
}
