<script lang="ts">
	export let name: string;
	export let isWhiteTurn: boolean;

	let highlight = false;

	function onMouseOver() {
		highlight = true;
	}

	function onMouseOff() {
		highlight = false;
	}
</script>

<g on:mouseenter={onMouseOver} on:mouseleave={onMouseOff}>
	<circle
		r="40"
		class:fill-black-move={!isWhiteTurn}
		class:fill-white-move={isWhiteTurn}
		class:stroke-3={!highlight}
		class:stroke-7={highlight}
		class:stroke-black-move={isWhiteTurn}
		class:stroke-white-move={!isWhiteTurn}
	/>
	<text
		text-anchor="middle"
		font-family="Roboto Mono, monospace"
		font-weight="600"
		font-size="35"
		class:fill-black-move={isWhiteTurn}
		class:fill-white-move={!isWhiteTurn}
		dy=".35em"
	>
		{name}
	</text>
</g>
