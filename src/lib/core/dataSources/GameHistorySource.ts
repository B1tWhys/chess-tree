import type GameTree from "../GameTree";

export interface GameHistorySource {
    downloadGameHistory(username: string): Promise<GameTree>;
}