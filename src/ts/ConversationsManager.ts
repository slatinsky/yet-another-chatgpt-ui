import { get, writable, type Writable } from "svelte/store";
import { ConversationModel } from "./ConversationModel";
import { getConversations, saveConversations } from "./helpers";
import type { ConversationJson } from "./types";

class ConversationsManager {
    conversations: Writable<ConversationModel[]>;
    selectedConversation: Writable<ConversationModel | null>;
    maxId: number;

    constructor() {
        this.maxId = 0;
        this.conversations = writable([]);
        this.selectedConversation = writable(null);

        getConversations().then((conversations: ConversationJson[]) => {
            let conversationIds = conversations.map((conversation: ConversationJson) => conversation.id);

            // initialize conversations
            for (let id of conversationIds) {
                this.maxId = Math.max(this.maxId, id);
                let conversation = new ConversationModel(id);
                this.conversations.update((conversations: ConversationModel[]) => {
                    return [conversation, ...conversations];
                });
            }

            this.selectConversationById(this.maxId);
        });
    }

    selectConversationById(id: number): void {
        const conversation = get(this.conversations).find((conversation: ConversationModel) => conversation.id === id);
        if (conversation === undefined) {
            console.warn("Conversation ID not found:", id);
            return;
        }
        this.selectedConversation.set(conversation);
    }

    newConversation(): ConversationModel {
        this.maxId += 1;
        let conversation = new ConversationModel(this.maxId);
        console.log("this.maxId", this.maxId);

        this.conversations.update((conversations: ConversationModel[]) => {
            return [conversation, ...conversations];
        });

        // switch to new conversation
        this.selectedConversation.set(conversation);

        return conversation;
    }

    async deleteConversation(id: number) {
        const conversationToDelete = get(this.conversations).find((conversation: ConversationModel) => conversation.id === id);
        console.log("deleting", conversationToDelete);

        if (conversationToDelete === undefined) {
            return;
        }

        // delete from live store
        this.conversations.update((conversations: ConversationModel[]) => {
            return conversations.filter((conversation: ConversationModel) => {
                return conversation.id !== id;
            });
        });

        // delete from database
        let conversations = await getConversations();
        conversations = conversations.filter((conversation: ConversationJson) => {
            return conversation.id !== id;
        });
        await saveConversations(conversations);

        // if currently selected conversation was deleted, select the first one
        const selectedConversation = get(this.selectedConversation);
        if (selectedConversation === conversationToDelete) {
            if (conversations.length === 0) {
                this.selectedConversation.set(null);
            }
            else {
                this.selectConversationById(get(this.conversations)[0].id);
            }
        }
    }
}


const conversationsManager = new ConversationsManager();
export { conversationsManager };