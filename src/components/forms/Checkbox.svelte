<script lang="ts">
    export let label = "";
    export let checked: any
    let randomId = Math.random().toString(36).substring(7);
</script>


<div class="flex gap-2">
    <input type="checkbox" class="w-6 h-6" id={randomId} bind:checked >
    <label for={randomId} class="text-white">{label}</label>
</div>
