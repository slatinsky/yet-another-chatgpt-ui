import localforage from "localforage";
import type { ConversationJson } from "./types";

export async function getConversations(): Promise<ConversationJson[]> {
    let conversations = await localforage.getItem("gptui-conversations") as ConversationJson[];
    if (conversations === null) {
        conversations = [];
    }
    return conversations;
}

export async function getConversationIds(): Promise<number[]> {
    let conversationsIds = await localforage.getItem("gptui-conversations-ids") as number[];
    if (conversationsIds === null) {
        conversationsIds = [];
    }
    return conversationsIds;
}

export async function saveConversations(conversations: ConversationJson[]) {
    await localforage.setItem("gptui-conversations", conversations);
}