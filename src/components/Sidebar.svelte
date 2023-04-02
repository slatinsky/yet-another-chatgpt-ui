<script lang="ts">
    import Modal from "./Modal.svelte";
	import Settings from "./Settings.svelte";
	import SidebarItem from "./SidebarItem.svelte";
    import { conversationsManager } from "$ts/ConversationsManager";
    let conversations = conversationsManager.conversations;

    let settingsOpen = false;

    function showHideModal() {
        settingsOpen = !settingsOpen;
    }

    function newConversation() {
        conversationsManager.newConversation();
    }
</script>

<div class="bg-slate-900 min-w-[300px] py-4 text-white flex flex-col">
    <div class="text-xl px-4 mb-2">Yet another ChatGPT UI</div>
    <button on:click={newConversation} class="text-sm bg-slate-600 hover:bg-slate-500 px-2 py-1 w-full">New topic</button>
    <div class="flex-1 overflow-y-auto overflow-x-hidden">
        {#each $conversations as conversation (conversation.id)}
            <SidebarItem conversation={conversation} />
        {/each}
    </div>
    <button on:click={showHideModal} class="text-sm bg-slate-600 hover:bg-slate-500 px-2 py-1 w-full mt-2">
        Settings
    </button>
</div>



<Modal title={"Settings"} open={settingsOpen} on:close={showHideModal}>
    <Settings />
</Modal>
