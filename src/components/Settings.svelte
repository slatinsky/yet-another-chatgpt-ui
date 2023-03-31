<script lang="ts">
	import Input from "./forms/Input.svelte";
    let apiToken = "123";
    let model = "gpt-3.5-turbo"
</script>

<div class="flex flex-col gap-4 mb-8">
    <Input label="API token" bind:value={apiToken} />
    <Input label="Model" bind:value={model} />
</div>