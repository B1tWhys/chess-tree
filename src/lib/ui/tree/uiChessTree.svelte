<script lang="ts">
	import { hierarchy, select, tree, type HierarchyNode } from 'd3';
	import type GameTree from '$lib/core/GameTree';
	import { onMount } from 'svelte';

	export let gameTree: GameTree;

	let el: HTMLElement, width: number, height: number;

	$: root = hierarchy(gameTree.rootMoves[0]);
	$: treeGen = tree().size([width, height]);
	$: treeLayout = treeGen(root);

	onMount(() => {
		select(el)
			.data(treeLayout)
			.enter()
			.append('circle')
			.attr('cx', (d) => d.x)
			.attr('cy', (d) => d.y);
	});
</script>

<div class="h-full" bind:this={el} bind:clientHeight={height} bind:clientWidth={width} >
</div>
