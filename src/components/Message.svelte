<script lang="ts">
	import type { Message } from "$ts/types";
	import { conversationsManager } from "$ts/ConversationsManager";
    const selectedConversation = conversationsManager.selectedConversation
    const memoryId = $selectedConversation?.memoryId;

    console.log("$selectedConversation", $selectedConversation);

    export let message: Message;
    $: memoryMarkerShown = ($memoryId === message.id) as boolean;

    function clearMemory() {
        $memoryId = 1;
    }

    function setMemory() {
        $memoryId = message.id;
    }

    function deleteMessage() {
        if (!$selectedConversation) {
            return;
        }
        $selectedConversation.deleteMessage(message.id);
    }
</script>


<div class={(message.role === "assistant" ? "bg-gray-700" : "") + " relative"}>
    {#if memoryMarkerShown}
        <div class="absolute top-0 w-full flex flex-col items-center border-b-2 border-red-600 text-sm text-red-500 -translate-y-full">
            <h3>Memory</h3>
        </div>
    {/if}

    <div class="flex justify-end gap-4 mr-4 pt-2 text-gray-300">
        {#if memoryMarkerShown}
            <button on:click={clearMemory} class="bg-gray-600 hover:bg-gray-500 px-1 py-1 text-sm">Clear memory</button>
        {:else}
            <button on:click={setMemory} class="bg-gray-600 hover:bg-gray-500 px-1 py-1 text-sm">Set memory</button>
        {/if}
        <button on:click={deleteMessage} class="bg-gray-600 hover:bg-gray-500 px-1 py-1 text-sm">Delete message</button>
        <button class="bg-gray-600 hover:bg-gray-500 px-1 py-1 text-sm">Show raw</button>
    </div>

    <div class="px-4 pt-2 pb-8 text-gray-200">
        {message.text}
    </div>
</div>


