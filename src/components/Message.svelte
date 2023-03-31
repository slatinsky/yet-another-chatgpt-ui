<script lang="ts">
    export let type: "assistant" | "user" = "user";

    export let memoryMarkerShown: boolean = false;
</script>


<div class={(type === "assistant" ? "bg-gray-700" : "") + " relative"}>
    {#if memoryMarkerShown}
        <div class="absolute top-0 w-full flex flex-col items-center border-b-2 border-red-600 text-sm text-red-500 -translate-y-full">
            <h3>Memory</h3>
        </div>
    {/if}


    <div class="flex justify-end gap-4 mr-4 pt-2">
        {#if memoryMarkerShown}
            <button class="bg-gray-600 hover:bg-gray-500 px-1 py-1">Clear memory</button>
        {:else}
            <button class="bg-gray-600 hover:bg-gray-500 px-1 py-1">Set memory</button>
        {/if}
        <button class="bg-gray-600 hover:bg-gray-500 px-1 py-1">Delete message</button>
        <button class="bg-gray-600 hover:bg-gray-500 px-1 py-1">Show raw</button>
    </div>

    <div class="px-4 pt-2 pb-8">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rerum, asperiores. Animi saepe officia impedit voluptatem dolore, ipsa quo facere recusandae, voluptate vero dolorum ut necessitatibus, quam eum? Atque, labore animi?
    </div>
</div>


