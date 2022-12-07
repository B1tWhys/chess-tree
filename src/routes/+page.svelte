<script lang="ts">
	import GameTree from '$lib/core/GameTree';
	import Chessboard from '$lib/ui/chessboard.svelte';
	import ChessTree from '$lib/ui/tree/uiChessTree.svelte';

	const pgn = '1. d3 d6 2. e4 (2. e3 f6 (2... f5) 3. f4) *';
	const tree = GameTree.fromPgnStr(pgn);
</script>

<div class="flex flex-col h-full">
	<div class="text-center bg-gray-800 text-gray-50">Menu bar</div>
	<div class="relative flex-grow">
		<Chessboard />
		<div class="bg-neutral-900 h-full">
			<ChessTree gameTree={tree} />
		</div>
	</div>
</div>
