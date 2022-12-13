<script lang="ts">
	import { ChessDotComGameHistorySource } from '$lib/core/dataSources/ChessDotComGameHistorySource';
	import type GameTree from '$lib/core/GameTree';
	import { gameTree } from '$lib/stores';

	let username: string;
	const dataSource = new ChessDotComGameHistorySource();

	function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		const gameHistoryPromise: Promise<GameTree> = dataSource.downloadGameHistory(username);
		gameHistoryPromise.then((t) => {
			gameTree.set(t);
		});
	}
</script>

<div class="h-full w-80 p-2 bg-gray-800 text-gray-50">
	<div>
		<form on:submit={onSubmit}>
			<div>Load games</div>
			<label for="username">Chess.com username</label>
			<input type="text" name="username" class="text-black" bind:value={username} />
			<button type="submit">Go!</button>
		</form>
	</div>
	<div class="h-0.5 bg-gray-300 my-2 rounded-full" />
</div>
