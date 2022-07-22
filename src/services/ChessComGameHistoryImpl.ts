import {ChessComGameHistoryService} from "./definitions/ChessComGameHistory";

// API Docs: https://www.chess.com/news/view/published-data-api

class ArchiveUrls {
    archives: Array<string>;
}

export default class ChessComGameHistoryImpl implements ChessComGameHistoryService {
    private static instance: ChessComGameHistoryImpl;

    private constructor() {
    }

    public static getInstance() {
        if (!ChessComGameHistoryImpl.instance) {
            ChessComGameHistoryImpl.instance = new ChessComGameHistoryImpl();
        }

        return ChessComGameHistoryImpl.instance;
    }

    async getLastGamePgn(username: string): Promise<string> {
        const archiveUrls = await ChessComGameHistoryImpl.getArchiveUrls(username);
        const lastArchiveUrl = archiveUrls.archives[0];
        const archiveResp = await (await fetch(lastArchiveUrl)).json();
        const games = archiveResp['games'];
        return games[games.length - 1]["pgn"];
    }

    private static async getArchiveUrls(username: string): Promise<ArchiveUrls> {
        const url = `https://api.chess.com/pub/player/${username}/games/archives`;
        const resp = await fetch(url);
        return await resp.json();
    }
}