import { get, writable, type Writable } from "svelte/store";
import type { ConversationJson, Message } from "./types";
import { getConversations, saveConversations } from "./helpers";

export class ConversationModel {
    id: number;
    order: Writable<number>;
    name: Writable<string>;
    role: Writable<string>;
    messages: Writable<Message[]>;
    memoryId: Writable<number>;

    private _unsubscribeName: any;
    private _unsubscribeMessages: any;
    private _unsubscribeOrder: any;
    private _unsubscribeRole: any;

    constructor(id: number) {
        this.id = id;

        // initialize stores and load defaults
        this.name = writable<string>("untitled topic " + String(id));
        this.role = writable<string>("");
        this.messages = writable<Message[]>([]);
        this.order = writable<number>(id);
        this.memoryId = writable<number>(1);

        getConversations().then((conversations: ConversationJson[]) => {
            let conversation = conversations.find((conversation: ConversationJson) => {
                return conversation.id === this.id;
            });
            if (conversation !== undefined) {
                this.order.set(conversation.order);
                this.name.set(conversation.name);
                this.role.set(conversation.role);
                this.messages.set(conversation.messages);
                this.memoryId.set(conversation.memoryId);
            }

            // autosave
            this._unsubscribeName = this.name.subscribe(async (name: string) => {
                await this.save();
            })
            this._unsubscribeMessages = this.messages.subscribe(async (messages: Message[]) => {
                await this.save();
            })
            this._unsubscribeOrder = this.order.subscribe(async (order: number) => {
                await this.save();
            })
            this._unsubscribeRole = this.role.subscribe(async (role: string) => {
                await this.save();
            })
        });
    }

    async save() {
        // console.log("saving", this.id);

        let conversations = await getConversations();

        // remove old conversation
        conversations = conversations.filter((conversation: ConversationJson) => {
            return conversation.id !== this.id;
        });

        // add new conversation
        conversations.push({
            id: this.id,
            order: get(this.order),
            name: get(this.name),
            role: get(this.role),
            messages: get(this.messages),
            memoryId: get(this.memoryId),
            version: 1,
        });

        await saveConversations(conversations);
    }

    addMessage(text: string, role: "user" | "assistant" | "warning") {
        let timestamp = new Date().toISOString();
        let id = get(this.messages).reduce((maxId: number, message: Message) => {
            return Math.max(maxId, message.id);
        }, 0);
        let message: Message = {
            id: id + 1,
            role: role,
            text: text,
            timestamp: timestamp,
        };
        this.messages.update((messages: Message[]) => [...messages, message]);
    }

    deleteMessage(id: number) {
        this.messages.update((messages: Message[]) => {
            return messages.filter((message: Message) => message.id !== id);
        });
    }

    destroy() {
        this._unsubscribeName();
        this._unsubscribeMessages();
        this._unsubscribeOrder();
        this._unsubscribeRole();
    }
}