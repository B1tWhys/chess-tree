<script lang="ts">
	import { Chessground } from 'chessground/chessground';
	import type { FEN } from 'chessground/types';
	import type { Api } from 'chessground/api';
	import type { Config } from 'chessground/config';
	import 'chessground/assets/chessground.base.css';
	import 'chessground/assets/chessground.brown.css';
	import 'chessground/assets/chessground.cburnett.css';
	import './chessboard.css';
	import { onMount } from 'svelte';

	export let fen: string;

	let cg: Api;
	let board: HTMLElement;

	let config: Config = { fen: fen, viewOnly: true };

	onMount(() => {
		cg = Chessground(board, config);
	});

	$: {
		console.log('fen update triggered config change');
		config.fen = fen;
		if (cg) {
			cg.set(config);
		}
	}
</script>

<div class="absolute box-border right-0 border-l-4 border-b-4 border-white rounded-bl-md">
	<div bind:this={board} class="w-80 h-80" />
</div>

<style>
</style>
