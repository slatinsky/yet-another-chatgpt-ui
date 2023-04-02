<script lang="ts">
	import type { ConversationModel } from "$ts/ConversationModel";
	import { conversationsManager } from "$ts/ConversationsManager";
	import { ai } from "$ts/openai/ai";
	import type { Writable } from "svelte/store";
	import Message from "./Message.svelte";


    let message = "";

    const selectedConversation = conversationsManager.selectedConversation as Writable<ConversationModel | null>;  // store
        $selectedConversation?.role

    const systemMessage = $selectedConversation?.systemMessage;    // store
    const allMessages = $selectedConversation?.messages;            // store
    const memoryId = $selectedConversation?.memoryId;              // store

    console.log("memoryId", $memoryId);
    console.log("allMessages", $allMessages);

    $: messagesInMemory = $allMessages?.filter((message: any) => message.id >= ($memoryId ?? 0));

    function simulateUser() {
        if (!$selectedConversation) {
            return null;
        }
        if (message) {
            const newMessage = $selectedConversation.addMessage(message, "user", 0);
            message = "";
            return newMessage;
        }

        return null;
    }

    function simulateAssistant() {
        if (!$selectedConversation) {
            return null;
        }
        if (message) {
            const newMessage = $selectedConversation.addMessage(message, "assistant", 0);
            message = "";
            return newMessage;
        }
    }

    async function aiComplete() {
        if (!$selectedConversation) {
            return;
        }

        const messages = []

        if ($systemMessage !== '') {
            messages.push({role: 'system', content: $systemMessage})
        }

        for (const message of messagesInMemory) {
            messages.push({role: message.role, content: message.content})
        }

        console.log("messages to api", messages);
        const res = await ai.complete(messages);
        $selectedConversation.addMessage(res.message.content, res.message.role, res.totalTokens);
    }

    async function send() {
        const newMessage = simulateUser()
        if (!newMessage) {
            console.warn("No message to send");
            return;
        }
        setTimeout(() => {   // wait for store to update
            aiComplete()
        }, 0);

    }

    async function sendWithoutHistory() {
        const newMessage = simulateUser()

        if (!newMessage) {
            console.warn("No message to send");
            return;
        }

        $memoryId = newMessage.id  // reset memory

        setTimeout(() => {   // wait for store to update
            aiComplete()
        }, 0);
    }

    function keydown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            if (event.shiftKey) {
                return;
            }
            if (event.ctrlKey) {
                sendWithoutHistory();
            }
            else {
                event.preventDefault();
                send();
            }
        }
    }
</script>


<div class="w-full flex text-white">
    <textarea on:keydown={keydown} class="w-full bg-gray-500 px-2" name="" id="" rows="3" placeholder="Type your message here. To insert new line, press shift+enter." bind:value={message} />
    <button on:click={send} class="bg-gray-600 hover:bg-gray-500 px-1 py-1">Send [enter]</button>
    <button on:click={sendWithoutHistory} class="bg-gray-600 hover:bg-gray-500 px-1 py-1">Send without history [ctrl+enter]</button>
    <!-- <button on:click={simulateUser} class="bg-gray-600 hover:bg-gray-500 px-1 py-1">Simulate user</button>
    <button on:click={simulateAssistant} class="bg-gray-600 hover:bg-gray-500 px-1 py-1">Simulate ChatGPT</button> -->
</div>
