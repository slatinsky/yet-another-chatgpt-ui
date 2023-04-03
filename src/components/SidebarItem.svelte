<script lang="ts">
	import type { ConversationModel } from "$ts/ConversationModel";
	import { conversationsManager } from "$ts/ConversationsManager";
    import IconArrowUp from "$assets/arrow-up.svg";
    import IconArrowDown from "$assets/arrow-down.svg";
    import IconEdit from "$assets/edit.svg";
    import IconTrashAlt from "$assets/trash-alt.svg";

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
    <div class="sidebar-item bg-slate-800 pl-4 py-2 pr-2 mt-2 hover:bg-slate-700 flex justify-between" on:click={selectCoversation}>
        <div>{$name}</div>
        <div>
            <button title="move topic up"  on:click|stopPropagation={up} class="text-sm bg-slate-600 hover:bg-slate-500 px-2 py-1">
                <img class="w-3 h-5 invert" alt="" src={IconArrowUp} />
            </button>
            <button title="move topic down" on:click|stopPropagation={down} class="text-sm bg-slate-600 hover:bg-slate-500 px-2 py-1">
                <img class="w-3 h-5 invert" alt="" src={IconArrowDown} />
            </button>
            <button title="rename topic" on:click|stopPropagation={renameConversation} class="text-sm bg-slate-600 hover:bg-slate-500 px-2 py-1">
                <img class="w-3 h-5 invert" alt="" src={IconEdit} />
            </button>
            <button title="delete topic"on:click|stopPropagation={deleteConversation} class="text-sm bg-slate-600 hover:bg-slate-500 px-2 py-1">
                <img class="w-3 h-5 invert" alt="" src={IconTrashAlt} />
            </button>
        </div>
    </div>

    {#if $selectedConversation && $selectedConversation.id === id}
        <textarea class="w-full bg-slate-700 px-2" name="" id="" rows="3" bind:value={$systemMessage} placeholder="Chat topic. Example: 'Ubuntu 22.04 CLI.'" />
    {/if}
</div>

<style>
   :global(img path) {
    fill: white;
  }

  .sidebar-item button {
    visibility: hidden;
  }

  .sidebar-item:hover button {
    visibility: visible;
  }
</style>