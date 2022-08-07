import {StudyProviderService} from "./definitions/StudyProviderService";
import {Mutex} from "async-mutex";

// API Docs: https://www.chess.com/news/view/published-data-api

class ArchiveUrls {
    archives: Array<string>;
}

export default class ChessComStudyProviderImpl implements StudyProviderService {
    private static instance: ChessComStudyProviderImpl;
    private static requestMutex = new Mutex();

    public static getInstance() {
        if (!ChessComStudyProviderImpl.instance) {
            ChessComStudyProviderImpl.instance = new ChessComStudyProviderImpl();
        }

        return ChessComStudyProviderImpl.instance;
    }

    private static async throttledJsonRequest<T>(url: string): Promise<T> {
        return await ChessComStudyProviderImpl.requestMutex.runExclusive(async () =>
            await (await fetch(url)).json());
    }

    async getLastGamePgn(username: string): Promise<string> {
        const archiveUrls = (await ChessComStudyProviderImpl.getArchiveUrls(username));
        const lastArchiveUrl = archiveUrls[0];
        const archiveResp = await ChessComStudyProviderImpl.throttledJsonRequest(lastArchiveUrl);
        const games = archiveResp['games'];
        return games[games.length - 1]["pgn"];
    }

    async getAllGamePgns(username: string): Promise<Array<string>> {
        class ResponseGame {
            pgn?: string;
        }

        class ArchiveResponse {
            games: Array<ResponseGame>;
        }

        const archiveUrls = await ChessComStudyProviderImpl.getArchiveUrls(username);
        const archiveResponses: Array<ArchiveResponse> = await Promise.all(archiveUrls.slice(archiveUrls.length - 3) // FIXME: make this configurable
            .map(url => ChessComStudyProviderImpl.throttledJsonRequest<ArchiveResponse>(url)));

        return archiveResponses
            .flatMap(r => r.games)
            .map(g => g.pgn);
    }

    private static async getArchiveUrls(username: string): Promise<string[]> {
        const url = `https://api.chess.com/pub/player/${username}/games/archives`;
        const resp = await this.throttledJsonRequest<ArchiveUrls>(url);
        return resp.archives;
    }
}