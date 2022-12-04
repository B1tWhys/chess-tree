<script lang="ts">
	import Chessboard from './chessboard.svelte';
</script>

<div class="flex flex-col h-full">
	<div class="text-center bg-gray-800 text-gray-50">Menu bar</div>
	<div class="relative flex-grow">
        <Chessboard />
		<div class="bg-neutral-900 h-full" />
	</div>
</div>
