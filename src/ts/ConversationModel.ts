import { get, writable, type Writable } from "svelte/store";
import type { ConversationJson, Message } from "./types";
import { getConversationById, getConversationIds, saveConversation, saveConversationIds } from "./stores/conversationsStores";

export class ConversationModel {
    id: number;
    name: Writable<string>;
    systemMessage: Writable<string>;
    messages: Writable<Message[]>;
    memoryId: Writable<number>;

    private _unsubscribeName: any;
    private _unsubscribeMessages: any;
    private _unsubscribeSystemMessage: any;
    private _unsubscribeMemoryId: any;

    constructor(id: number) {
        this.id = id;

        // initialize stores and load defaults
        this.name = writable<string>("untitled topic " + String(id));
        this.systemMessage = writable<string>("");
        this.messages = writable<Message[]>([]);
        this.memoryId = writable<number>(1);

        getConversationById(id).then(async(conversation: ConversationJson | null) => {
            if (conversation) {
                console.log("loaded conversation", conversation);
                this.name.set(conversation.name);
                this.systemMessage.set(conversation.systemMessage);
                this.messages.set(conversation.messages);
                this.memoryId.set(conversation.memoryId);
            }
            else {
                // it is a new conversation - add to a list of conversations
                let conversationsIds = await getConversationIds();
                conversationsIds.push(id);
                await saveConversationIds(conversationsIds);  // POSSIBLE RACE CONDITION if multiple conversations are created at the same time
            }

            // autosave
            this._unsubscribeName = this.name.subscribe(async (name: string) => {
                await this.save();
            })
            this._unsubscribeMessages = this.messages.subscribe(async (messages: Message[]) => {
                await this.save();
            })
            this._unsubscribeSystemMessage = this.systemMessage.subscribe(async (role: string) => {
                await this.save();
            })
            this._unsubscribeMemoryId = this.memoryId.subscribe(async (memoryId: number) => {
                await this.save();
            })
        });
    }

    async save() {
        // add new conversation
        const conversationJson = {
            id: this.id,
            name: get(this.name),
            systemMessage: get(this.systemMessage),
            messages: get(this.messages),
            memoryId: get(this.memoryId),
            version: 1,
        };

        await saveConversation(conversationJson);
    }

    addMessage(content: string, role: "user" | "assistant" | "warning", promptTokens: number, completionTokens: number): Message {
        let timestamp = new Date().toISOString();
        let id = get(this.messages).reduce((maxId: number, message: Message) => {
            return Math.max(maxId, message.id);
        }, 0);
        let message: Message = {
            id: id + 1,
            role: role,
            content: content,
            timestamp: timestamp,
            promptTokens: promptTokens,
            completionTokens: completionTokens
        };
        this.messages.update((messages: Message[]) => [...messages, message]);
        return message;
    }

    deleteMessage(id: number) {
        this.messages.update((messages: Message[]) => {
            return messages.filter((message: Message) => message.id !== id);
        });
    }

    destroy() {
        this._unsubscribeName();
        this._unsubscribeMessages();
        this._unsubscribeSystemMessage();
        this._unsubscribeMemoryId();
    }
}