export interface ConversationJson {
    id: number;
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
    promptTokens: number;
    completionTokens: number;
}

export interface AImessage {
    role: "user" | "assistant" | "warning";
    content: string;
}

export interface AIcomplete {
    message: AImessage;
    promptTokens: number;
    completionTokens: number;
}