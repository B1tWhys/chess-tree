<script lang="ts">
	import { Chessground } from 'chessground/chessground';
	import 'chessground/assets/chessground.base.css';
	import 'chessground/assets/chessground.brown.css';
	import 'chessground/assets/chessground.cburnett.css';
	import '$lib/ui/chessboard.css';
	import { onMount } from 'svelte';

	let cg;
	let board: HTMLElement;
	let config = {};

	onMount(() => {
		cg = Chessground(board, config);
	});
</script>

<div class="absolute box-border right-0 border-l-4 border-b-4 border-white rounded-bl-md">
	<div bind:this={board} class="w-80 h-80" />
</div>

<style>
</style>
