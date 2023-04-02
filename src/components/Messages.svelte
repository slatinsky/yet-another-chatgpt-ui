<script lang="ts">
	import Message from "./Message.svelte";
	import { conversationsManager } from "$ts/ConversationsManager";
	import type { Writable } from "svelte/store";

    const selectedConversation = conversationsManager.selectedConversation
    $: messages = $selectedConversation?.messages as Writable<Message[]> | undefined

    $: console.log("messages", messages);
</script>

<div class="bg-gray-800 flex-1 overflow-y-auto overflow-x-hidden">
    {#if !$messages || $messages.length === 0}
        <div class="text-white text-center text-2xl mt-4">No messages</div>
    {:else}
        {#each $messages as message}
            <Message message={message}/>
        {/each}
    {/if}
</div>