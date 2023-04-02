import { get, writable, type Writable } from "svelte/store";
import { ConversationModel } from "./ConversationModel";
import { deleteConversationById, getConversationIds, saveConversationIds } from "./stores/conversationsStores";

class ConversationsManager {
    conversations: Writable<ConversationModel[]>;
    selectedConversation: Writable<ConversationModel | null>;
    maxId: number;

    constructor() {
        this.maxId = 0;
        this.conversations = writable([]);
        this.selectedConversation = writable(null);

        getConversationIds().then((conversationIds: number[]) => {
            console.log("conversationIds", conversationIds);

            // initialize conversations
            for (let id of conversationIds) {
                this.maxId = Math.max(this.maxId, id);
                let conversation = new ConversationModel(id);
                this.conversations.update((conversations: ConversationModel[]) => {
                    return [conversation, ...conversations];
                });
            }

            // preselect last conversation
            if (conversationIds.length > 0) {
                this.selectConversationById(conversationIds[conversationIds.length - 1]);
            }
        });
    }


    async sortConversationsByOrder(): Promise<void> {
        const conversationsIds = await getConversationIds()
                // swap order in live store
        this.conversations.update((conversations: ConversationModel[]) => {
            const sorted = [...conversations].sort((a: ConversationModel, b: ConversationModel) => {
                return conversationsIds.indexOf(b.id) - conversationsIds.indexOf(a.id);
            });
            return sorted;
        });
    }

    selectConversationById(id: number): void {
        const conversation = get(this.conversations).find((conversation: ConversationModel) => conversation.id === id);
        if (conversation === undefined) {
            console.warn("Conversation ID not found:", id);
            return;
        }
        console.log("selecting", conversation.id, get(conversation.name));
        this.selectedConversation.set(conversation);
    }

    async newConversation(): Promise<ConversationModel> {
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
        this.selectedConversation.set(null)

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
        await deleteConversationById(id);

        let conversationsIds = await getConversationIds()
        conversationsIds = conversationsIds.filter((conversationId: number) => conversationId !== id);
        await saveConversationIds(conversationsIds)   // POSSIBLE RACE CONDITION if multiple conversations are deleted at the same time
    }

    async moveConversationDown(id: number) {
        let conversationsIds = await getConversationIds()

        // get index of conversation
        const index = conversationsIds.findIndex((conversationId: number) => conversationId === id);

        if (index === 0) {
            console.log("Already at bottom");
            return;
        }

        // swap order in database
        const aboveConversationId = conversationsIds[index - 1];
        conversationsIds[index - 1] = id;
        conversationsIds[index] = aboveConversationId;

        console.log("new order", conversationsIds);

        // save to database
        await saveConversationIds(conversationsIds);

        await this.sortConversationsByOrder()
    }

    async moveConversationUp(id: number) {
        let conversationsIds = await getConversationIds()

        // get index of conversation
        const index = conversationsIds.findIndex((conversationId: number) => conversationId === id);

        if (index === conversationsIds.length - 1) {
            console.log("Already at top");
            return;
        }

        // swap order in database
        const belowConversationId = conversationsIds[index + 1];
        conversationsIds[index + 1] = id;
        conversationsIds[index] = belowConversationId;

        console.log("new order", conversationsIds);

        // save to database
        await saveConversationIds(conversationsIds);

        await this.sortConversationsByOrder()
    }
}


const conversationsManager = new ConversationsManager();
export { conversationsManager };