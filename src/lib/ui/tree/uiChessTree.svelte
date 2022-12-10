<script lang="ts">
	import {
		hierarchy,
		select,
		tree,
		zoom,
		type HierarchyNode,
		type HierarchyPointNode,
		type ZoomBehavior
	} from 'd3';
	import type GameTree from '$lib/core/GameTree';
	import { onMount } from 'svelte';
	import type { MoveNode } from '$lib/core/MoveNode';
	import ChessTreeCircle from './chessTreeCircle.svelte';

	export let gameTree: GameTree;

	let treeSvg: SVGElement;
	let panZoomContainer: SVGElement;

	let width: number, height: number;

	$: root = hierarchy(gameTree.rootMoves[0]);

	function handleZoom(e: ZoomBehavior<Element, any>) {
		select(panZoomContainer).attr('transform', e.transform as any);
	}

	/*
	<g transform="translate(150, 310)">
		<circle r="40" fill="#eeeed2" stroke="#769656" stroke-width="7"></circle>
		<text text-anchor="middle" font-family="Roboto Mono, monospace" font-weight="600" font-size="35" fill="#769656" dy=".35em">b4</text>
		</g>
	*/

	onMount(() => {
		const treeGen = tree().nodeSize([100, 150]);
		const treeLayout = treeGen(root) as HierarchyPointNode<MoveNode>;
		const nodeGroups = select(panZoomContainer)
			.selectAll('circle')
			.data(treeLayout)
			.enter()
			.append('g')
			.attr('transform', (d) => `translate(${d.x}, ${d.y})`);

		nodeGroups
			.append('circle')
			.attr('r', 40)
			.attr('class', (d) => {
				const fill = d.data.isWhiteTurn ? 'fill-white-move' : 'fill-black-move';
				const stroke = !d.data.isWhiteTurn ? 'stroke-white-move' : 'stroke-black-move';
				return [fill, stroke, 'stroke-7'].join(' ');
			});

		nodeGroups
			.append('text')
			.attr('class', (d) => (d.data.isWhiteTurn ? 'fill-black-move' : 'fill-white-move'))
			.attr('text-anchor', 'middle')
			.attr('font-family', 'Roboto Mono, monospace')
			.attr('font-weight', 600)
			.attr('font-size', '25')
			.attr('dy', '.35em')
			.text((d) => d.data.name);

		let z = zoom().on('zoom', handleZoom);
		select(treeSvg).call(z as any);
	});
</script>

<div class="h-full" bind:clientHeight={height} bind:clientWidth={width}>
	<svg bind:this={treeSvg} {width} {height}>
		<g bind:this={panZoomContainer} />
	</svg>
</div>
