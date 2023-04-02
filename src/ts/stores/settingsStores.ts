import { writable } from "svelte/store";
import localforage from "localforage";

async function persistentWritable<T>(key: string, initialValue: any) {
    const store = writable<T>(initialValue);

    const json = await localforage.getItem(key);
    if (json) {
        store.set(json as T);
    }

    store.subscribe(async (value) => {
        await localforage.setItem(key, value);
    });

    return store;
}

const apiToken = await persistentWritable<string>("gptui-apitoken", "");
const apiModel = await persistentWritable<string>("gptui-apimodel", "gpt-3.5-turbo");

export { apiToken, apiModel };