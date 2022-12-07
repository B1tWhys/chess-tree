<script lang="ts">
	import type { MoveNode } from '$lib/core/MoveNode';
	import { children } from 'svelte/internal';
	import ChessTreeCircle from './chessTreeCircle.svelte';

	export let moveNode: MoveNode;
	export let offset: { x: number; y: number };

	const childXOffset = 120;
	const childYOffset = 120;

	$: numChildren = moveNode.children.length;
	$: childCenterX = ((numChildren - 1) * childXOffset) / 2;
	$: isWhiteTurn = moveNode.isWhiteTurn;
</script>

<g transform="translate({offset.x}, {offset.y})">
	<ChessTreeCircle {isWhiteTurn} name={moveNode.name} />
	{#each moveNode.children as mn, i}
		{@const xo = i * childXOffset - childCenterX}
		<svelte:self moveNode={mn} offset={{ x: xo, y: childYOffset }} />
	{/each}
</g>
