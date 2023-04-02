import localforage from "localforage";
import type { ConversationJson } from "./types";

export async function getConversations(): Promise<ConversationJson[]> {
    let conversations = await localforage.getItem("gptui-conversations") as ConversationJson[];
    if (conversations === null) {
        conversations = [];
    }
    return conversations;
}


export async function saveConversations(conversations: ConversationJson[]) {
    await localforage.setItem("gptui-conversations", conversations);
}