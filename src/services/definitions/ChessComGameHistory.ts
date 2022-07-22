export interface ChessComGameHistoryService {
    getLastGamePgn(username: string): Promise<string>;
}
