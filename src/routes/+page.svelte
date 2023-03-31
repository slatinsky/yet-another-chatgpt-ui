<script lang="ts">

    import Bottombar from "$components/Bottombar.svelte";
    import Messages from "$components/Messages.svelte";
    import Sidebar from "$components/Sidebar.svelte";

</script>

<div class="flex h-full">
    <Sidebar />
    <div class="flex flex-col">
        <Messages />
        <Bottombar />
    </div>
</div>

