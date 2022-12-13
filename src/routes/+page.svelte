<script lang="ts">
	import Chessboard from '$lib/ui/chessboard.svelte';
	import ControlPannel from '$lib/ui/controlPannel/controlPannel.svelte';
	import ChessTree from '$lib/ui/tree/uiChessTree.svelte';
	import { gameTree } from '$lib/stores';
</script>

<div class="flex flex-row h-full">
	<ControlPannel />
	<div class="relative grow">
		<Chessboard />
		<div class="bg-neutral-900 h-full">
			<ChessTree gameTree={$gameTree} />
		</div>
	</div>
</div>
