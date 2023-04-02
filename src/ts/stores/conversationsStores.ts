import localforage from "localforage";
import type { ConversationJson } from "../types";

export async function getConversationIds(): Promise<number[]> {
    let conversationsIds = await localforage.getItem("gptui-conversations-ids") as number[];
    if (conversationsIds === null) {
        conversationsIds = [];
    }
    return conversationsIds;
}

export async function saveConversationIds(conversationsIds: number[]) {
    await localforage.setItem("gptui-conversations-ids", conversationsIds);
}

export async function getConversationById(id: number): Promise<ConversationJson | null> {
    const conversation = await localforage.getItem("gptui-conversation-" + String(id)) as ConversationJson | null
    return conversation;
}

export async function saveConversation(conversation: ConversationJson) {
    await localforage.setItem("gptui-conversation-" + String(conversation.id), conversation);
}

export async function deleteConversationById(id: number) {
    await localforage.removeItem("gptui-conversation-" + id);
}