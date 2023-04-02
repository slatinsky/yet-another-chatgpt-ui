<script lang="ts">
    import Bottombar from "$components/Bottombar.svelte";
    import Messages from "$components/Messages.svelte";
    import Sidebar from "$components/Sidebar.svelte";
	import { conversationsManager } from "$ts/ConversationsManager";
	import { apiToken } from "$ts/stores/settingsStores";

    let conversations = conversationsManager.conversations;

    const selectedConversation = conversationsManager.selectedConversation  // store

    apiToken
</script>

<div class="flex h-full">
    <Sidebar />
    {#if $apiToken === ""}
        <div class="flex-1 flex items-center justify-center text-white text-2xl">Please set api token in the settings</div>
    {:else if !$selectedConversation}
        <div class="flex-1 flex items-center justify-center text-white text-2xl">Select a topic</div>
    {:else}
        <div class="flex-1 flex flex-col">
            <Messages />
            <Bottombar />
        </div>
    {/if}
</div>

