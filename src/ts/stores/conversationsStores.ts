import localforage from "localforage";
import type { ConversationJson } from "../types";
import { writable } from "svelte/store";
import { browser } from "$app/environment";

export async function getConversationIds(): Promise<number[]> {
    if (!browser) return [];
    let conversationsIds = await localforage.getItem("gptui-conversations-ids") as number[];
    if (conversationsIds === null) {
        conversationsIds = [];
    }
    return conversationsIds;
}

export async function saveConversationIds(conversationsIds: number[]) {
    if (!browser) return;
    await localforage.setItem("gptui-conversations-ids", conversationsIds);
}

export async function getConversationById(id: number): Promise<ConversationJson | null> {
    if (!browser) return null;
    const conversation = await localforage.getItem("gptui-conversation-" + String(id)) as ConversationJson | null
    return conversation;
}

export async function saveConversation(conversation: ConversationJson) {
    if (!browser) return;
    await localforage.setItem("gptui-conversation-" + String(conversation.id), conversation);
}

export async function deleteConversationById(id: number) {
    if (!browser) return;
    await localforage.removeItem("gptui-conversation-" + id);
}


export const temporaryMessageText = writable<string>("")