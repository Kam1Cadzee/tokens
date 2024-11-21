import { PayloadToken } from "./Vanya";

export const saveSelected = (type: 'meme' | 'vanya' | 'now', tag: number, date: string | undefined) => {
    const data = loadSelected(type, date) ?? [];

    data.push(tag);

    if(date) {
        localStorage.setItem(`${type}.${date}`, JSON.stringify(data));
       }
       else {
        localStorage.setItem(`${type}`, JSON.stringify(data));
       }
}

export const removeSelected = (type: 'meme' | 'vanya' | 'now', tag: number, date: string | undefined) => {
    let data = loadSelected(type, date) ?? [];

    data = data.filter(item => item !== tag);

    if(date) {
        localStorage.setItem(`${type}.${date}`, JSON.stringify(data));
       }
       else {
        localStorage.setItem(`${type}`, JSON.stringify(data));
       }
}

export const loadSelected = (type: 'meme' | 'vanya' | 'now', date: string | undefined) => {
   if(date) {
    const data = localStorage.getItem(`${type}.${date}`);

    return data ? JSON.parse(data) as number[] : [];
   }
   else {
    const data = localStorage.getItem(`${type}`);

    return data ? JSON.parse(data) as number[] : [];
   }
}