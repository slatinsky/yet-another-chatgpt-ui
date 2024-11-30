<script>
	import '../app.postcss';
	import { storesAreLoading } from '../ts/stores/settingsStores';
</script>



{#if $storesAreLoading}
	<div class="h-full flex items-center justify-center">
		<div class="text-2xl text-gray-500">Loading...</div>
	</div>
{:else}
	<div class="h-full">
		<slot />
	</div>
{/if}