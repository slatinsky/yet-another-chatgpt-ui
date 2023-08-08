<script lang="ts">
	import Message from "./Message.svelte";
	import { conversationsManager } from "$ts/ConversationsManager";
	import type { Writable } from "svelte/store";
	import { temporaryMessageText } from "$ts/stores/conversationsStores";
	import { scrollDown } from "$ts/helpers";
	import { onMount } from "svelte";

    const selectedConversation = conversationsManager.selectedConversation
    $: messages = $selectedConversation?.messages as Writable<Message[]> | undefined

    $: console.log("messages", messages);

    $: $temporaryMessageText, scrollDown()  // scroll down when temporary message changes

    onMount(() => {
        scrollDown();
    })
</script>

<div class="bg-gray-800 flex-1 overflow-y-auto overflow-x-hidden" id="messages-container">
    {#if !$messages || $messages.length === 0}
        <div class="text-white text-center text-2xl mt-4">No messages</div>
    {:else}
        {#each $messages as message}
            <Message message={message}/>
            {/each}

        {#if $temporaryMessageText !== ""}
            <Message message={{
                id: 99999999999,
                role: "assistant" ,
                content: $temporaryMessageText + "█",
                timestamp: new Date().toISOString(),
                promptTokens: 0,
                completionTokens: 0
            }}/>
        {/if}
    {/if}
</div>