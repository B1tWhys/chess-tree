<script lang="ts">
	// import type { MoveNode } from '$lib/core/MoveNode';
	import type GameTree from '$lib/core/GameTree';
	import ChessTreeNode from './chessTreeNode.svelte';

	export let gameTree: GameTree;
</script>

<svg class="w-full h-full">
	<ChessTreeNode moveNode={gameTree.rootMoves[0]} offset={{ x: 200, y: 200 }} />
</svg>
