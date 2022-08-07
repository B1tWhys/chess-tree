export interface StudyProviderService {
    getLastGamePgn(username: string): Promise<string>;
    getAllGamePgns(username: string): Promise<Array<string>>;
}
