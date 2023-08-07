<script lang="ts">
    // import markdown-it
    import MarkdownIt from "markdown-it";

    import IconHistory from "$assets/history.svg";
    import IconTrashAlt from "$assets/trash-alt.svg";
    import IconCode from "$assets/code.svg";
    import IconAlignLeft from "$assets/align-left.svg";



    const md = new MarkdownIt();

	import type { Message } from "$ts/types";
	import { conversationsManager } from "$ts/ConversationsManager";
    const selectedConversation = conversationsManager.selectedConversation
    $: memoryId = $selectedConversation?.memoryId;

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
</script>


<div class={(message.role === "assistant" ? "bg-gray-700" : "") + " " + (message.role === "warning" ? "bg-orange-900" : "") + " relative message"}>
    {#if memoryMarkerShown}
        <div class="absolute top-0 w-full flex flex-col items-center border-b-2 border-red-600 text-sm text-red-500 -translate-y-full">
            <h3>Memory</h3>
        </div>
    {/if}

    <div class="flex justify-end gap-4 mr-4 pt-2 text-gray-300">
        {#if memoryMarkerShown}
            <button disabled title="memory is already set to this message" class="bg-gray-900 hover:bg-gray-900 px-2 py-1 text-sm">
                <img class="w-3 h-5 invert" alt="clear memory" src={IconHistory} />
            </button>
        {:else}
            <button title="set memory" on:click={setMemory} class="bg-gray-600 hover:bg-gray-500 px-2 py-1 text-sm">
                <img class="w-3 h-5 invert" alt="" src={IconHistory} />
            </button>
        {/if}
        <button title="delete message" on:click={deleteMessage} class="bg-gray-600 hover:bg-gray-500 px-2 py-1 text-sm">
            <img class="w-3 h-5 invert" alt="" src={IconTrashAlt} />
        </button>
        {#if showRaw}
            <button title="show formatted" on:click={toggleRaw} class="bg-gray-600 hover:bg-gray-500 px-2 py-1 text-sm">
                <img class="w-3 h-5 invert" alt="" src={IconAlignLeft} />
            </button>
            {:else}
            <button title="show raw" on:click={toggleRaw} class="bg-gray-600 hover:bg-gray-500 px-2 py-1 text-sm">
                <img class="w-3 h-5 invert" alt="" src={IconCode} />
            </button>
        {/if}
    </div>

    {#if showRaw}
        <pre class="px-4 pt-2 pb-8 text-gray-200 whitespace-pre-wrap">{message.content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
    {:else}
        <div class="px-4 pt-2 pb-8 text-gray-200 message-content">
            {@html md.render(message.content)}
        </div>

        {#if message.promptTokens + message.completionTokens > 0}
            <div class="px-4 pb-2 text-gray-500 text-xs text-end">USED {message.promptTokens + message.completionTokens} TOKENS</div>
        {/if}
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

    .message-content :global(ol) {
        list-style-type: decimal;
        padding-left: 2rem;
    }

    .message-content :global(ul) {
        list-style-type: disc;
        padding-left: 2rem;
    }

    .message-content :global(ol > li),
    .message-content :global(ul > li) {
        margin: 0.5rem 0;
    }

    .message button {
        visibility: hidden;
    }

    .message:hover button {
        visibility: visible;
    }
</style>

