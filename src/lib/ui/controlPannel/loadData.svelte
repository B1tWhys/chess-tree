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

<div>
	<form on:submit={onSubmit}>
		<div class="font-bold text-xl mb-3">Load games</div>
		<div class="flex">
			<label for="chessdotcom-username">Chess.com</label>
			<input
				type="text"
				name="chessdotcom-username"
				class="text-black ml-2 pl-1"
				bind:value={username}
				placeholder="username"
			/>
		</div>
		<button
			class="bg-black-move text-white-move my-3 rounded-sm py-0.5 px-2 font-semibold"
			type="submit"
		>
			Go!
		</button>
	</form>
</div>
<div class="h-0.5 bg-gray-300 rounded-full" />
