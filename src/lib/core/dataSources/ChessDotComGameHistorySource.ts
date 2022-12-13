import GameTree from '../GameTree';
import type { GameHistorySource } from './GameHistorySource';
import { Mutex } from 'async-mutex';

class ArchiveUrls {
	archives!: [string];
}
class ResponseGame {
	pgn!: string;
}

class ArchiveResponse {
	games!: [ResponseGame];
}

export class ChessDotComGameHistorySource implements GameHistorySource {
	private static instance: ChessDotComGameHistorySource;
	private static requestMutex = new Mutex();

	public static getInstance() {
		if (!ChessDotComGameHistorySource.instance) {
			ChessDotComGameHistorySource.instance = new ChessDotComGameHistorySource();
		}

		return ChessDotComGameHistorySource.instance;
	}

	private static async throttledJsonRequest<T>(url: string): Promise<T> {
		return await ChessDotComGameHistorySource.requestMutex.runExclusive(
			async () => await (await fetch(url)).json()
		);
	}

	async downloadGameHistory(username: string): Promise<GameTree> {
		const games = await this.getAllGamePgns(username);
		const trees = games.map(GameTree.fromPgnStr);
		return GameTree.merge(...trees);
	}

	private async getAllGamePgns(username: string): Promise<Array<string>> {
		const archiveUrls = await ChessDotComGameHistorySource.getArchiveUrls(username);
		const archiveResponses: Array<ArchiveResponse> = await Promise.all(
			archiveUrls.map((url) => ChessDotComGameHistorySource.throttledJsonRequest<ArchiveResponse>(url))
		);

		return archiveResponses.flatMap((r) => r.games).map((g) => g.pgn);
	}

	private static async getArchiveUrls(username: string): Promise<string[]> {
		const url = `https://api.chess.com/pub/player/${username}/games/archives`;
		const resp = await this.throttledJsonRequest<ArchiveUrls>(url);
		return resp.archives;
	}
}
