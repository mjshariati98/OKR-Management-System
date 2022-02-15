import axios from 'axios';

export function createOrUpdateNote(note: Partial<INote>) {
    return axios({
        method: note.id ? 'put' : 'post',
        url: '/notes/' + (note.id || 'new'),
        data: note,
    });
}
