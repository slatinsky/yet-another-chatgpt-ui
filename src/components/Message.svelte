<script lang="ts">
    // import markdown-it
    import MarkdownIt from "markdown-it";

    const md = new MarkdownIt();

	import type { Message } from "$ts/types";
	import { conversationsManager } from "$ts/ConversationsManager";
    const selectedConversation = conversationsManager.selectedConversation
    const memoryId = $selectedConversation?.memoryId;

    // console.log("$selectedConversation", $selectedConversation);

    export let message: Message;
    $: memoryMarkerShown = ($memoryId === message.id) as boolean;
    const role = message.role;

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


    let showRaw = false;
    function toggleRaw() {
        showRaw = !showRaw;
    }

    console.log("message.role", message.role);
</script>


<div class={(message.role === "assistant" ? "bg-gray-700" : "") + " " + (message.role === "warning" ? "bg-orange-900" : "") + " relative"}>
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
        <button on:click={toggleRaw} class="bg-gray-600 hover:bg-gray-500 px-1 py-1 text-sm">
            {#if showRaw}
                Show formatted
            {:else}
                Show raw
            {/if}
        </button>
    </div>

    {#if showRaw}
        <pre class="px-4 pt-2 pb-8 text-gray-200 whitespace-pre-wrap">{message.content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
    {:else}
        <div class="px-4 pt-2 pb-8 text-gray-200 message-content">
            {@html md.render(message.content)}
        </div>
    {/if}
</div>


<style>
    .message-content :global(pre) {
        background-color: #1a202c;
        border-radius: 0.25rem;
        padding: 1rem;
        margin: 1rem 0;
        white-space: pre-wrap;
    }
</style>

