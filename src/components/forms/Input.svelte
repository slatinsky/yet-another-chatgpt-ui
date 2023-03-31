<script lang="ts">
    export let value = "";
    export let type = "text";
    export let id: string = undefined;
    export let placeholder: string;
    export let domInput;
    export let label = "";
    export let name = "";
    export let required = false;
</script>

<style>
    input {
        margin-bottom: 6px;
        height: 54px;
        width: 100%;
    }
</style>

{#if type === "hidden"}
    <input type="hidden" on:keydown bind:this={domInput} {placeholder} {id} {name} bind:value required={required}>
{:else}
    <div class="flex flex-col">
        <label for="username" class="text-white mb-1">{label}</label>
        {#if type == "text"}
            <input class="w-full bg-white h-10 px-5 pr-4 text-sm focus:outline-none" on:keydown bind:this={domInput} {placeholder} {id} bind:value {name} required={required}>
        {:else if type == "password"}
            <input class="w-full bg-white h-10 px-5 pr-4 text-sm focus:outline-none" type="password" on:keydown bind:this={domInput} {placeholder} {id} bind:value  {name} required={required}>
        {:else if type == "date"}
            <input class="w-full bg-white h-10 px-5 pr-4 text-sm focus:outline-none" type="date" on:keydown bind:this={domInput} {placeholder} {id} bind:value {name} required={required}>
        {/if}
    </div>
{/if}

<!-- {JSON.stringify(value, null, 2)} -->