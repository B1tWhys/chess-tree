<script lang="ts">
	import {
		hierarchy,
		select,
		tree,
		zoom,
		type HierarchyPointLink,
		type HierarchyPointNode,
		type ZoomBehavior
	} from 'd3';
	import type GameTree from '$lib/core/GameTree';
	import { onMount } from 'svelte';
	import type { MoveNode } from '$lib/core/MoveNode';
	import { selectedMoveNode } from '$lib/stores';

	export let gameTree: GameTree;

	let treeSvg: SVGElement;
	let panZoomContainer: SVGElement;

	let width: number, height: number;

	function handleZoom(e: ZoomBehavior<Element, any>) {
		select(panZoomContainer).attr('transform', e.transform as any);
	}

	function handleMouseOver(d: MoveNode) {
		selectedMoveNode.set(d);
	}

	function calcLinkPathData(link: HierarchyPointLink<any>) {
		const avgY = (link.source.y + link.target.y) / 2;
		return `M ${link.source.x} ${link.source.y} C ${link.source.x} ${avgY}, ${link.target.x} ${avgY}, ${link.target.x} ${link.target.y}`;
	}

	$: root = hierarchy(gameTree.rootMoves[0]);
	const treeGen = tree().nodeSize([100, 150]);
	$: treeLayout = treeGen(root) as HierarchyPointNode<MoveNode>;

	onMount(() => {
		// setup pan/zoom
		let z = zoom().on('zoom', handleZoom);
		select(treeSvg)
			.call(z as any)
			.call(z.translateBy as any, width / 3, 100);
	});
</script>

<div class="h-full" bind:clientHeight={height} bind:clientWidth={width}>
	<svg bind:this={treeSvg} {width} {height}>
		<g bind:this={panZoomContainer}>
			{#each treeLayout.links() as link}
				<path class="stroke-7 stroke-neutral-300 fill-none" d={calcLinkPathData(link)} />
			{/each}

			{#each treeLayout.descendants() as node}
				{@const isSelectedNode = node.data === $selectedMoveNode}
				{@const isWhiteTurn = node.data.isWhiteTurn}

				<g
					transform={`translate(${node.x}, ${node.y})`}
					on:mouseover={() => handleMouseOver(node.data)}
					on:focus={() => {}}
				>
					<circle
						class="stroke-7 "
						class:fill-white-move={isWhiteTurn}
						class:fill-black-move={!isWhiteTurn}
						class:stroke-white-move={!isWhiteTurn && !isSelectedNode}
						class:stroke-black-move={isWhiteTurn && !isSelectedNode}
						class:stroke-blue-400={isSelectedNode}
						r="40"
					/>
					<text
						class="cursor-default"
						class:fill-white-move={!isWhiteTurn}
						class:fill-black-move={isWhiteTurn}
						text-anchor="middle"
						font-family="Roboto Mono, monospace"
						font-weight="600"
						font-size="25"
						dy=".35em"
					>
						{node.data.name}
					</text>
				</g>
			{/each}
		</g>
	</svg>
</div>
