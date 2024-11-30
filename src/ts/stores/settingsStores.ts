import { writable } from "svelte/store";
import localforage from "localforage";
import { browser } from "$app/environment";

let loadedCount = 0;

// TODO: refactor quick fix to svelte 5 runes
function persistentWritable<T>(key: string, initialValue: any) {
    const store = writable<T>(initialValue);

    if (browser) {
        localforage.getItem(key, (err, value) => {
            if (err) {
                console.error(err);
            }
            store.set(value);
            loadedCount++;
            if (loadedCount === 3) {
                storesAreLoading.set(false);
            }
        })

        store.subscribe(async (value) => {
            await localforage.setItem(key, value);
        });
    }
    return store;
}
export let storesAreLoading = writable(true);

let apiToken = persistentWritable<string>("gptui-apitoken", "");
let apiModel = persistentWritable<string>("gptui-apimodel", "gpt-3.5-turbo");
let showBranding = persistentWritable<boolean>("gptui-showbranding", true);

export { apiToken, apiModel, showBranding };