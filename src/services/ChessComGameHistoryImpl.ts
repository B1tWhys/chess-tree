import {ChessComGameHistoryService} from "./definitions/GameHistoryProxy";
import {Mutex} from "async-mutex";

// API Docs: https://www.chess.com/news/view/published-data-api

class ArchiveUrls {
    archives: Array<string>;
}

export default class ChessComGameHistoryImpl implements ChessComGameHistoryService {
    private static instance: ChessComGameHistoryImpl;
    private static requestMutex = new Mutex();

    public static getInstance() {
        if (!ChessComGameHistoryImpl.instance) {
            ChessComGameHistoryImpl.instance = new ChessComGameHistoryImpl();
        }

        return ChessComGameHistoryImpl.instance;
    }

    private static async throttledJsonRequest<T>(url: string): Promise<T> {
        return await ChessComGameHistoryImpl.requestMutex.runExclusive(async () =>
            await (await fetch(url)).json());
    }

    async getLastGamePgn(username: string): Promise<string> {
        const archiveUrls = await ChessComGameHistoryImpl.getArchiveUrls(username);
        const lastArchiveUrl = archiveUrls.archives[0];
        const archiveResp = await ChessComGameHistoryImpl.throttledJsonRequest(lastArchiveUrl);
        const games = archiveResp['games'];
        return games[games.length - 1]["pgn"];
    }

    async getAllGamePgns(username: string): Promise<Array<string>> {
        const archiveUrls = await ChessComGameHistoryImpl.getArchiveUrls(username);
        const archiveResponses: Object[] = await Promise.all(archiveUrls.archives
            .map(url => ChessComGameHistoryImpl.throttledJsonRequest<Object>(url)));
        return archiveResponses
            .filter(r => "pgn" in r)
            .map(r => r["pgn"]);
    }

    private static async getArchiveUrls(username: string): Promise<ArchiveUrls> {
        const url = `https://api.chess.com/pub/player/${username}/games/archives`;
        return this.throttledJsonRequest<ArchiveUrls>(url);
    }
}