<script lang="ts">
	import Message from "./Message.svelte";

</script>

<div class="bg-gray-800 flex-1 overflow-y-auto overflow-x-hidden">
    <Message type="user"/>
    <Message type="assistant" memoryMarkerShown={true} />
    <Message type="user"/>
    <Message type="assistant"/>
</div>