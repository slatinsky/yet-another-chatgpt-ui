import type { Writable } from "svelte/store";

export interface ConversationJson {
    id: number;
    order: number;
    name: string;
    systemMessage: string;
    messages: any[];
    memoryId: number;
    version: number;
}

export interface Message {
    id: number;
    role: "user" | "assistant" | "warning";
    content: string;
    timestamp: string;
    totalTokens: number;
}

export interface AImessage {
    role: "user" | "assistant" | "warning";
    content: string;
}

export interface AIcomplete {
    message: AImessage;
    totalTokens: number;
}