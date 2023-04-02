<script lang="ts">
	import { apiToken, apiModel } from "$ts/stores/settingsStores";
	import Input from "./forms/Input.svelte";
</script>

<div class="flex flex-col gap-4 mb-8">
    <Input label="API token" bind:value={$apiToken} />
    <Input label="Model" bind:value={$apiModel} />
</div>