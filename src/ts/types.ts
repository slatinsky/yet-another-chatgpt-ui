import type { Writable } from "svelte/store";

export interface ConversationJson {
    id: number;
    order: number;
    name: string;
    role: string;
    messages: any[];
    memoryId: number;
    version: number;
}

export interface Message {
    id: number;
    role: "user" | "assistant" | "warning";
    text: string;
    timestamp: string;
}
