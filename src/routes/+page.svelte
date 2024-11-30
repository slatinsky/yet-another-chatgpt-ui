<script lang="ts">
    import Bottombar from "$components/Bottombar.svelte";
    import Messages from "$components/Messages.svelte";
    import Sidebar from "$components/Sidebar.svelte";
	import { conversationsManager } from "$ts/ConversationsManager";
	import { apiToken } from "$ts/stores/settingsStores";
	import { onMount } from "svelte";
	import { get } from "svelte/store";

    let conversations = conversationsManager.conversations;

    const selectedConversation = conversationsManager.selectedConversation  // store

    let pageTitle = "YACGPTUI"
    function selectedConversationChanged(selectConv) {
        if (selectConv) {
            pageTitle = get(selectConv.name);
        }
        else {
            pageTitle = "YACGPTUI"
        }
    }
    $: selectedConversationChanged($selectedConversation)

    onMount(() => {
        if ($selectedConversation) {
            $selectedConversation.name.subscribe((newName) => {
                pageTitle = newName;
                console.log("new name", newName);
            })
        }
    })
</script>

<!-- title -->

<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>

<div class="flex h-full">
    <Sidebar />
    {#if $apiToken === ""}
        <div class="flex-1 flex items-center justify-center text-white text-2xl">Please set api token in the settings</div>
    {:else if !$selectedConversation}
        <div class="flex-1 flex items-center justify-center text-white text-2xl">Select a topic</div>
    {:else}
        <div class="flex-1 flex flex-col">
            {#key $selectedConversation}
                <Messages />
            {/key}
            <Bottombar />
        </div>
    {/if}
</div>

