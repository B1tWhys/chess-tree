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

	$: root = hierarchy(gameTree.rootMoves[0]);

	function handleZoom(e: ZoomBehavior<Element, any>) {
		select(panZoomContainer).attr('transform', e.transform as any);
	}

	function calcLinkPathData(link: HierarchyPointLink<any>) {
		const avgY = (link.source.y + link.target.y) / 2;
		return `M ${link.source.x} ${link.source.y} C ${link.source.x} ${avgY}, ${link.target.x} ${avgY}, ${link.target.x} ${link.target.y}`;
	}

	function handleMouseOver(e: any, d: HierarchyPointNode<MoveNode>) {
		selectedMoveNode.set(d.data);
	}

	onMount(() => {
		const treeGen = tree().nodeSize([100, 150]);
		const treeLayout = treeGen(root) as HierarchyPointNode<MoveNode>;

		// links

		select(panZoomContainer)
			.selectAll('line')
			.data(treeLayout.links())
			.enter()
			.append('path')
			.attr('d', calcLinkPathData)
			.attr('class', 'stroke-7 stroke-neutral-300 fill-none');

		// nodes
		const nodeGroups = select(panZoomContainer)
			.selectAll('g')
			.data(treeLayout)
			.enter()
			.append('g')
			.attr('transform', (d) => `translate(${d.x}, ${d.y})`)
			.on('mouseover', handleMouseOver);

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
			.attr(
				'class',
				(d) => 'cursor-default ' + (d.data.isWhiteTurn ? 'fill-black-move' : 'fill-white-move')
			)
			.attr('text-anchor', 'middle')
			.attr('font-family', 'Roboto Mono, monospace')
			.attr('font-weight', 600)
			.attr('font-size', '25')
			.attr('dy', '.35em')
			.text((d) => d.data.name);

		// panning/zooming

		let z = zoom().on('zoom', handleZoom);
		select(treeSvg)
			.call(z as any)
			.call(z.translateBy as any, width / 3, 100);
	});
</script>

<div class="h-full" bind:clientHeight={height} bind:clientWidth={width}>
	<svg bind:this={treeSvg} {width} {height}>
		<g bind:this={panZoomContainer} />
	</svg>
</div>
