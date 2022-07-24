export interface ChessComGameHistoryService {
    getLastGamePgn(username: string): Promise<string>;
    getAllGamePgns(username: string): Promise<Array<string>>;
}
