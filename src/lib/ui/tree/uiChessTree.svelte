<script lang="ts">
	import { hierarchy, select, tree, zoom, type ZoomBehavior } from 'd3';
	import type GameTree from '$lib/core/GameTree';
	import { onMount } from 'svelte';

	export let gameTree: GameTree;

	let treeSvg: SVGElement;
	let panZoomContainer: SVGElement;

	let width: number, height: number;

	$: root = hierarchy(gameTree.rootMoves[0]);

	function handleZoom(e: ZoomBehavior<SVGElement, unknown>) {
		select(panZoomContainer).attr('transform', e.transform);
	}

	onMount(() => {
		const treeGen = tree().size([width, height]);
		const treeLayout = treeGen(root);
		select(panZoomContainer)
			.selectAll('circle')
			.data(treeLayout)
			.enter()
			.append('circle')
			.attr('cx', (d) => d.x)
			.attr('cy', (d) => d.y)
			.attr('r', 50)
			.attr('class', 'fill-white-move stroke-black-move stroke-7');

		let z = zoom().on('zoom', handleZoom);
		select(treeSvg).call(z);
	});
</script>

<div class="h-full" bind:clientHeight={height} bind:clientWidth={width}>
	<svg bind:this={treeSvg} {width} {height}>
		<g bind:this={panZoomContainer} />
	</svg>
</div>
