<script lang="ts">
	import { apiToken, apiModel, showBranding } from "$ts/stores/settingsStores";
	import Input from "./forms/Input.svelte";
	import Checkbox from "./forms/Checkbox.svelte";

    $: console.log("showBranding", $showBranding, typeof $showBranding);
    
</script>

<div class="flex flex-col gap-4 mb-8">
    <Input label="API token" bind:value={$apiToken} />
    <Input label="Model" bind:value={$apiModel} />
    <Checkbox label="Show branding" bind:checked={$showBranding} />
</div>