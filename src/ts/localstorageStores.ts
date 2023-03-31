import { browser } from '$app/environment';
import { writable } from 'svelte/store'

export function writableString(key: string, initialValue: string) {
    if (!browser) {
        return writable(initialValue);
    }
    let localstorageValue = localStorage.getItem(key);
    if (localstorageValue !== null) {
        initialValue = localstorageValue;
    }

    const { subscribe, set, update } = writable(initialValue);

    subscribe(current => {
        localStorage.setItem(key, current);
    });

    return {
        subscribe,
        set,
        update,
    };
}