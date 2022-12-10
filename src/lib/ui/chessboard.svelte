<script lang="ts">
	import { Chessground } from 'chessground/chessground';
	import type { Config } from 'chessground/config';
	import 'chessground/assets/chessground.base.css';
	import 'chessground/assets/chessground.brown.css';
	import 'chessground/assets/chessground.cburnett.css';
	import '$lib/ui/chessboard.css';
	import { onMount } from 'svelte';
	import { selectedMoveNode } from '$lib/stores';
	import { onDestroy } from 'svelte';
	import type { Api } from 'chessground/api';

	let cg: Api;
	let board: HTMLElement;
	let config: Config = {
		viewOnly: true
	};

	let unsubscribe = selectedMoveNode.subscribe((mn) => {
		console.debug(`new move node selected: ${mn?.fen}`);
		if (mn?.fen) {
			config.fen = mn.fen;
		} else {
			config.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
		}
		cg?.set(config);
	});

	onMount(() => {
		cg = Chessground(board, config);
	});

	onDestroy(unsubscribe);
</script>

<div class="absolute box-border right-0 border-l-4 border-b-4 border-white rounded-bl-md z-50">
	<div bind:this={board} class="w-80 h-80" />
</div>

<style>
</style>
