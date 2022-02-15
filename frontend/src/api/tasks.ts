import axios, { AxiosError } from 'axios';
import { queryClient } from 'src/global/query-client';
import { endPoints } from './enpoints';

export function createOrUpdateNote(note: Partial<INote>) {
    return axios({
        method: note.id ? 'put' : 'post',
        url: '/notes/' + (note.id || 'new'),
        data: note,
    });
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
