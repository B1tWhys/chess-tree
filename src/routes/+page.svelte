<script lang="ts">
	import Chessboard from './chessboard.svelte';

	let fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

	function changeFen() {
		console.log('updating fen');
		fen = 'rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR w KQkq - 0 1';
	}
</script>

<div class="flex flex-col h-full">
	<div class="text-center bg-gray-800 text-gray-50">Menu bar</div>
	<div class="relative flex-grow">
		<Chessboard {fen} />
		<div class="bg-neutral-900 h-full">
			<button class="bg-white rounded-sm" on:click={changeFen}>Change fen</button>
		</div>
	</div>
</div>
