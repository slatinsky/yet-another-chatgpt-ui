<script lang="ts">
	import type { ConversationModel } from "$ts/ConversationModel";
	import { conversationsManager } from "$ts/ConversationsManager";

    export let conversation: ConversationModel;

    const name = conversation.name;    // store
    $: id = conversation.id;           // not a store
    const systemMessage = conversation.systemMessage;    // store

    $: selectedConversation = conversationsManager.selectedConversation;

    function deleteConversation() {
        conversationsManager.deleteConversation(id);
    }

    function renameConversation() {
        const newName = prompt("Enter new name", $name);
        if (newName) {
            $name = newName;
        }
    }

    function selectCoversation() {
        conversationsManager.selectConversationById(id);
    }

    function up() {
        conversationsManager.moveConversationUp(id);
    }

    function down() {
        conversationsManager.moveConversationDown(id);
    }
</script>

<div>
    <div class="bg-slate-800 px-4 py-2 mt-2 hover:bg-slate-700 flex justify-between" on:click={selectCoversation}>
        <div>{$name}</div>
        <div>
            <button on:click|stopPropagation={up} class="text-sm bg-slate-600 hover:bg-slate-500 px-2 py-1">up</button>
            <button on:click|stopPropagation={down} class="text-sm bg-slate-600 hover:bg-slate-500 px-2 py-1">down</button>
            <button on:click|stopPropagation={renameConversation} class="text-sm bg-slate-600 hover:bg-slate-500 px-2 py-1">rename</button>
            <button on:click|stopPropagation={deleteConversation} class="text-sm bg-slate-600 hover:bg-slate-500 px-2 py-1">delete</button>
        </div>
    </div>

    {#if $selectedConversation && $selectedConversation.id === id}
        <textarea class="w-full bg-slate-700 px-2" name="" id="" rows="3" bind:value={$systemMessage} placeholder="Chat topic. Example: 'Ubuntu 22.04 CLI.'" />
    {/if}
</div>