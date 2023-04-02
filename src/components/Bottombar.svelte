<script lang="ts">
	import type { ConversationModel } from "$ts/ConversationModel";
	import { conversationsManager } from "$ts/ConversationsManager";
	import type { Writable } from "svelte/store";


    let message = "";

    const selectedConversation = conversationsManager.selectedConversation as Writable<ConversationModel | null>;  // store


    function simulateUser() {
        if (!$selectedConversation) {
            return;
        }
        if (message) {
            $selectedConversation.addMessage(message, "user");
            message = "";
        }
    }

    function simulateAssistant() {
        if (!$selectedConversation) {
            return;
        }
        if (message) {
            $selectedConversation.addMessage(message, "assistant");
            message = "";
        }
    }
</script>


<div class="w-full flex text-white">
    <textarea class="w-full bg-gray-500 px-2" name="" id="" rows="3" placeholder="Type your message here. To insert new line, press shift+enter." bind:value={message} />
    <button class="bg-gray-600 hover:bg-gray-500 px-1 py-1">Send</button>
    <button class="bg-gray-600 hover:bg-gray-500 px-1 py-1">Send without history</button>
    <button on:click={simulateUser} class="bg-gray-600 hover:bg-gray-500 px-1 py-1">Simulate user</button>
    <button on:click={simulateAssistant} class="bg-gray-600 hover:bg-gray-500 px-1 py-1">Simulate ChatGPT</button>
</div>
