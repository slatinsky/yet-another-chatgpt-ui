<script lang="ts">
	import Input from "./forms/Input.svelte";
import Modal from "./Modal.svelte";
	import Settings from "./Settings.svelte";
	import SidebarItem from "./SidebarItem.svelte";


    let settingsOpen = false;

    function showHideModal() {
        settingsOpen = !settingsOpen;
    }
</script>

<div class="bg-slate-900 min-w-[300px] py-4 text-white flex flex-col">
    <div class="text-xl px-4 mb-2">Yet another ChatGPT UI</div>
    <div class="flex-1 overflow-y-auto overflow-x-hidden">
        <SidebarItem />
        <SidebarItem />
        <SidebarItem />
        <SidebarItem />
    </div>
    <button on:click={showHideModal}>
        Settings
    </button>
</div>



<Modal title={"Settings"} open={settingsOpen} on:close={showHideModal}>
    <Settings />
</Modal>
